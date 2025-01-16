package ds2024.dtos;

import ds2024.entity.Chat;

public class ChatBuilder {

    public static Chat toEntity(ChatDTO chatDTO){
        return new Chat(chatDTO.getId(),chatDTO.getTimestamp(), chatDTO.getMessage(), chatDTO.getSender_id(), chatDTO.getReceiver_id(), chatDTO.getRead());
    }

    public static ChatDTO toChatDTO (Chat chat){
        return new ChatDTO(chat.getId(),chat.getTimestamp(),chat.getSenderId(),chat.getReceiverId(), chat.getMessage(), chat.isRead());
    }
}
