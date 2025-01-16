package ds2024;

import ds2024.services.MonitoringService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.validation.annotation.Validated;

import java.util.TimeZone;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "ds2024.repositories")
@Validated
public class MonitoringApplication extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(MonitoringApplication.class);
    }

    public static void main(String[] args) {

            TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
            SpringApplication.run(MonitoringApplication.class, args);


        ConfigurableApplicationContext context = SpringApplication.run(MonitoringApplication.class, args);
        MonitoringService monitoring = context.getBean(MonitoringService.class);
        monitoring.startListening();
    }
}
