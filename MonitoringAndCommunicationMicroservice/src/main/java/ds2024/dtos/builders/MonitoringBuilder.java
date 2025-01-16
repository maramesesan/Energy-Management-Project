package ds2024.dtos.builders;

import ds2024.dtos.MonitoringDTO;
import ds2024.entities.Monitoring;

public class MonitoringBuilder {

    public static MonitoringDTO toMonitoringDTO (Monitoring monitoring){
        return new MonitoringDTO(monitoring.getId(), monitoring.getDeviceId(), monitoring.getMeasurementValue(), monitoring.getTimestamp());
    }

    public static Monitoring toEntity (MonitoringDTO monitoringDTO){
        return new Monitoring(monitoringDTO.getDevice_id(),monitoringDTO.getMeasurement_value(), monitoringDTO.getTimestamp());
    }

}
