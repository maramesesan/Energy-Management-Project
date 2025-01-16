package ds2024.repositories;

import ds2024.entities.Monitoring;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

public interface MonitoringRepository extends JpaRepository<Monitoring, UUID> {

    List<Monitoring> findByDeviceId(UUID deviceId);

}
