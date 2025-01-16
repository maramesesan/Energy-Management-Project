package ds2024.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.ConnectionFactory;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import ds2024.dtos.MonitoringDTO;
import ds2024.dtos.builders.MonitoringBuilder;
import ds2024.entities.Monitoring;
import ds2024.repositories.MonitoringRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.sql.*;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.TimeoutException;
import java.util.stream.Collectors;

@Service
public class MonitoringService {

    private final MonitoringRepository monitoringRepository;
    private final NotificationService notificationService;
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final Logger LOGGER = LoggerFactory.getLogger(MonitoringService.class);
    private final Map<UUID, Double> hourlySums = new HashMap<>();
    private final Map<UUID, Long> lastUpdatedTimestamps = new HashMap<>();
    private static final String DB_URL = "jdbc:postgresql://host.docker.internal:5432/device_db";
//    private static final String DB_URL = "jdbc:postgresql://localhost:5432/device_db";

    private static final String DB_USER = "postgres";
    private static final String DB_PASS = "123";
    private static final HikariDataSource dataSource;

    @Autowired
    public MonitoringService(MonitoringRepository monitoringRepository, NotificationService notificationService) {
        this.monitoringRepository = monitoringRepository;
        this.notificationService = notificationService;
    }

    static {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(DB_URL);
        config.setUsername(DB_USER);
        config.setPassword(DB_PASS);
        config.setMaximumPoolSize(10);
        dataSource = new HikariDataSource(config);
    }


    public void startListening() {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("host.docker.internal");
//                factory.setHost("localhost");


        try (com.rabbitmq.client.Connection mqConnection = factory.newConnection();
             Channel channel = mqConnection.createChannel()) {

            channel.queueDeclare("energy_data_queue", false, false, false, null);
            System.out.println("Waiting for messages...");

            channel.basicConsume("energy_data_queue", true, (consumerTag, delivery) -> {
                String message = new String(delivery.getBody(), StandardCharsets.UTF_8);
                System.out.println("Received message: " + message);
                processMessage(message);
            }, consumerTag -> {});

            // Keep the method running to listen for messages
            while (true) {
                Thread.sleep(1000);
            }

        } catch (IOException | TimeoutException | InterruptedException e) {
            e.printStackTrace();
        }
    }

    public void processMessage(String message) {
        try {
            Map<String, Object> messageData = objectMapper.readValue(message, Map.class);
            UUID deviceId = UUID.fromString((String) messageData.get("device_id"));
            double measurementValue = (double) messageData.get("measurement_value");
            Long timestamp = (Long) messageData.get("timestamp");

            updateHourlySum(deviceId, measurementValue, timestamp);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    private void updateHourlySum(UUID deviceId, double measurementValue, Long timestamp) {
        long currentTime = System.currentTimeMillis();
        long lastUpdateTime = lastUpdatedTimestamps.getOrDefault(deviceId, 0L);

        double maxAllowedConsumption;
        try (Connection connection = dataSource.getConnection()) {
            maxAllowedConsumption = getMaxAllowedConsumption(connection, deviceId);
        } catch (SQLException e) {
            LOGGER.error("Failed to retrieve max consumption for device {}: {}", deviceId, e.getMessage());
            return;
        }

        double currentSum = hourlySums.getOrDefault(deviceId, 0.0) + measurementValue;
        hourlySums.put(deviceId, currentSum);

        if (currentSum / 4 > maxAllowedConsumption) {
            System.out.println("ALERT!");
            String notificationMessage = String.format(
                    "ALERT! Device %s has exceeded its hourly energy limit. Current usage: %.2f, Limit: %.2f",
                    deviceId, currentSum, maxAllowedConsumption
            );
            notificationService.sendNotification("/topic/alerts/" + deviceId, notificationMessage);
        }


//        if (currentTime - lastUpdateTime >= 60000) {
            if (currentTime - lastUpdateTime >= 2000) {

            MonitoringDTO monitoringDTO = new MonitoringDTO(deviceId, measurementValue, timestamp);
            create(monitoringDTO);
            lastUpdatedTimestamps.put(deviceId, currentTime);
            hourlySums.put(deviceId, 0.0);

        }

        hourlySums.put(deviceId, hourlySums.getOrDefault(deviceId, 0.0) + measurementValue);
    }

    private float getMaxAllowedConsumption(Connection dbConnection, UUID deviceId) throws SQLException {
        float energyConsumption = 0;

        String query = "SELECT \"energy-consumption\" FROM Device WHERE id = ?";
        try (PreparedStatement statement = dbConnection.prepareStatement(query)) {
            statement.setObject(1, deviceId);

            try (ResultSet rs = statement.executeQuery()) {
                if (rs.next()) {
                    energyConsumption = rs.getFloat("energy-consumption");
                }
            }
        }

        System.out.println(energyConsumption);
        return energyConsumption;
    }
    public MonitoringDTO create(MonitoringDTO monitoringDTO) {
        Monitoring monitoring = new Monitoring(monitoringDTO.getDevice_id(),monitoringDTO.getMeasurement_value(),monitoringDTO.getTimestamp());
        monitoring = monitoringRepository.save(monitoring);
        LOGGER.debug("Device with id {} was created", monitoring.getId());
        return MonitoringBuilder.toMonitoringDTO(monitoring);
    }

    public List<MonitoringDTO> findByDeviceId(UUID deviceId){
        List<Monitoring> monitorings = monitoringRepository.findByDeviceId(deviceId);
        return monitorings.stream().map(MonitoringBuilder::toMonitoringDTO).collect(Collectors.toList());
    }

    public List<MonitoringDTO> selectWithDate(String timestamp, List<MonitoringDTO> monitoringDTOS){
        List<MonitoringDTO> selectedDTOs = new ArrayList<>();

        Instant instant = Instant.ofEpochMilli(Long.parseLong(timestamp));
        LocalDate date = instant.atZone(ZoneId.systemDefault()).toLocalDate();

        String formattedTimestamp = date.format(DateTimeFormatter.ISO_LOCAL_DATE);

        for (MonitoringDTO dto : monitoringDTOS) {
            Instant instantDTO = Instant.ofEpochMilli(dto.getTimestamp());
            LocalDate dateDTO = instantDTO.atZone(ZoneId.systemDefault()).toLocalDate();

            String formattedDate = dateDTO.format(DateTimeFormatter.ISO_LOCAL_DATE);
            if(formattedDate.equals(formattedTimestamp)){
                selectedDTOs.add(dto);
            }
        }

        return selectedDTOs;
    }
}
