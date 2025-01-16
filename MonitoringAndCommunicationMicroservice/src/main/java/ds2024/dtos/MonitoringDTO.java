package ds2024.dtos;

import java.time.LocalDate;
import java.util.UUID;

public class MonitoringDTO {

    private UUID id;
    private UUID device_id;
    private double measurement_value;
    private long timestamp;

    public MonitoringDTO(UUID id, UUID device_id, double measurement_value, long timestamp) {
        this.id = id;
        this.device_id = device_id;
        this.measurement_value = measurement_value;
        this.timestamp = timestamp;
    }

    public MonitoringDTO(UUID device_id, double measurement_value, long timestamp) {
        this.device_id = device_id;
        this.measurement_value = measurement_value;
        this.timestamp = timestamp;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getDevice_id() {
        return device_id;
    }

    public void setDevice_id(UUID device_id) {
        this.device_id = device_id;
    }

    public double getMeasurement_value() {
        return measurement_value;
    }

    public void setMeasurement_value(double measurement_value) {
        this.measurement_value = measurement_value;
    }
}
