package ds2024.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class NotificationService {
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public NotificationService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendNotification(String destination, String message) {
        messagingTemplate.convertAndSend(destination, message);
    }

    public void sendReadingNotification(UUID senderId, UUID receiverId){
        messagingTemplate.convertAndSend("/topic/notifications/read/"+senderId+"/"+receiverId,"{\"status\":\"read\"}");
    }

    public void sendTypingNotification(UUID senderId, UUID receiverId){
        messagingTemplate.convertAndSend("/topic/notifications/typing/"+senderId+"/"+receiverId,"{\"status\":\"typing\"}");

    }

}
