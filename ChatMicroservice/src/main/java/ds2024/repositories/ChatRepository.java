package ds2024.repositories;

import ds2024.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ChatRepository extends JpaRepository<Chat, UUID> {
    List<Chat> findBySenderId (UUID senderId);
    List<Chat> findByReceiverId (UUID receiverId);
    List<Chat> findAllByReceiverIdAndSenderId (UUID senderId, UUID receiverId);
    List<Chat> findAllByReceiverIdAndSenderIdAndRead (UUID senderId, UUID receiverId, boolean read);




}
