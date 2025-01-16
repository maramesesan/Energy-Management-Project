package ds2024.services;

import ds2024.dtos.ChatBuilder;
import ds2024.dtos.ChatDTO;
import ds2024.entity.Chat;
import ds2024.repositories.ChatRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ChatService.class);

    private final ChatRepository chatRepository;
    private final NotificationService notificationService;


    @Autowired
    public ChatService(ChatRepository chatRepository, NotificationService notificationService) {
        this.chatRepository = chatRepository;
        this.notificationService = notificationService;
    }


    public ChatDTO create(ChatDTO chatDTO){
        Chat chat = new Chat(chatDTO.getId(), chatDTO.getTimestamp(), chatDTO.getMessage(), chatDTO.getSender_id(), chatDTO.getReceiver_id(), chatDTO.getRead());
        chat = chatRepository.save(chat);
        notificationService.sendNotification("/topic/messages/", chat.getMessage());
        LOGGER.debug("Chat with id {} was created", chat.getId());
        return ChatBuilder.toChatDTO(chat);
    }



    public List<ChatDTO> findBySender(UUID senderId){
        List<Chat> chats = chatRepository.findBySenderId(senderId);
        return chats.stream().map(ChatBuilder::toChatDTO).collect(Collectors.toList());
    }

    public List<ChatDTO> findByReceiver(UUID receiverId){
        List<Chat> chats = chatRepository.findByReceiverId(receiverId);
        return chats.stream().map(ChatBuilder::toChatDTO).collect(Collectors.toList());
    }

    public List<ChatDTO> findByReceiverAndSender(UUID receiverId, UUID senderId){
        List<Chat> chats = chatRepository.findAllByReceiverIdAndSenderId(senderId, receiverId);

        return chats.stream().map(ChatBuilder::toChatDTO).collect(Collectors.toList());

    }
    public List<ChatDTO> getReadMessages(UUID receiverId, UUID senderId){
        List<Chat> chats = chatRepository.findAllByReceiverIdAndSenderIdAndRead(receiverId, senderId, true);
        return chats.stream().map(ChatBuilder::toChatDTO).collect(Collectors.toList());
    }

    public int changeRead(UUID senderId, UUID receiverId) {
        List<Chat> unreadChats = chatRepository.findAllByReceiverIdAndSenderId(receiverId, senderId);

        if (unreadChats.isEmpty()) {
            return 0;
        }

        for (Chat chat : unreadChats) {
            chat.setRead(true);
        }

        chatRepository.saveAll(unreadChats);
        return unreadChats.size();
    }

}
