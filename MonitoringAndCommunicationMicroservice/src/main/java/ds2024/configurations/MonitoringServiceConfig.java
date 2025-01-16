package ds2024.configurations;

import ds2024.services.MonitoringService;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MonitoringServiceConfig {

    private final MonitoringService monitoringService;

    public MonitoringServiceConfig(MonitoringService monitoringService) {
        this.monitoringService = monitoringService;
    }

    @Bean
    public ApplicationRunner initializeListener() {
        return args -> monitoringService.startListening();
    }
}
