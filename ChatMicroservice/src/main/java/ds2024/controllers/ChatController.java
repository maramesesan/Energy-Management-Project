package ds2024.controllers;

import ds2024.dtos.ChatDTO;
import ds2024.dtos.ReadDTO;
import ds2024.services.ChatService;
import ds2024.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
public class ChatController {
    private final ChatService chatService;
    private final NotificationService notificationService;

    @Autowired
    public ChatController(ChatService chatService, NotificationService notificationService) {
        this.chatService = chatService;
        this.notificationService = notificationService;
    }

    @PostMapping("/create")
    public ChatDTO createChat(@RequestBody ChatDTO chatDTO){
    return chatService.create(chatDTO);
    }

    @GetMapping("/sent/{senderId}")
    public ResponseEntity<List<ChatDTO>> getSenderChats(@PathVariable("senderId") UUID senderId){
        List<ChatDTO> chats = chatService.findBySender(senderId);
        return new ResponseEntity<>(chats, HttpStatus.OK);
    }

    @GetMapping("/received/{receiverId}")
    public ResponseEntity<List<ChatDTO>> getReceiverChats(@PathVariable("receiverId") UUID receiverId){
        List<ChatDTO> chats = chatService.findByReceiver(receiverId);
        return new ResponseEntity<>(chats, HttpStatus.OK);
    }


    @GetMapping("/messages/{senderId}/{receiverId}")
    public ResponseEntity<List<ChatDTO>> getChats(@PathVariable("senderId") UUID senderId, @PathVariable("receiverId") UUID receiverId){
        List<ChatDTO> chats = chatService.findByReceiverAndSender(receiverId, senderId);
        return new ResponseEntity<>(chats, HttpStatus.OK);
    }

    @MessageMapping("/sendMessage")
    @SendTo("/topic/messages")
    public ChatDTO send( ChatDTO message) {
        chatService.create(message);
        return message;
    }


    @MessageMapping("/read")
    public void updateRead(@Payload ReadDTO readNotification) {
       notificationService.sendReadingNotification(readNotification.getSenderId(), readNotification.getReceiverId());
       chatService.changeRead(readNotification.getSenderId(), readNotification.getReceiverId());
    }

    @MessageMapping("/typing")
    public void typing(Map<String, String> payload) {
        UUID senderId = UUID.fromString(payload.get("senderId"));
        UUID receiverId = UUID.fromString(payload.get("receiverId"));
        notificationService.sendTypingNotification(senderId, receiverId);
    }



}
