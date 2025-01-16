package ds2024.controllers;

import ds2024.services.NotificationService;
import ds2024.dtos.MonitoringDTO;
import ds2024.services.MonitoringService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Controller
public class MonitoringController {
    @Autowired
    private NotificationService notificationService;

    private final MonitoringService monitoringService;

    public MonitoringController(MonitoringService monitoringService) {
        this.monitoringService = monitoringService;
    }

//    @GetMapping("/sendTestMessage")
//    public String sendTestMessage(@RequestParam String message) {
//        notificationService.sendNotification("/topic/alerts", message);
//        return "Test message sent: " + message;
//    }

    @MessageMapping("/send")
    @SendTo("/topic/alerts")
    public String handleMessage(String message) {
        System.out.println("Received WebSocket message from client: " + message);
        return "Server received: " + message;
    }

    @GetMapping("/details/{timestamp}/{deviceId}")
    public ResponseEntity<List<MonitoringDTO>> getByTimeAndDevice(@PathVariable("timestamp") String timestamp, @PathVariable("deviceId") UUID deviceId){
        System.out.println(timestamp);
        List<MonitoringDTO> monitoringDTOS = monitoringService.findByDeviceId(deviceId);
        List<MonitoringDTO> selectedDTOS = monitoringService.selectWithDate(timestamp, monitoringDTOS);
        return new ResponseEntity<>(selectedDTOS, HttpStatus.OK);
    }


}
