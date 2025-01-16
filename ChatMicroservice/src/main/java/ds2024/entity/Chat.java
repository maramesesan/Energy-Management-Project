package ds2024.entity;

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.UUID;

@Entity
public class Chat implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "timestamp")
    private long timestamp;

    @Column(name = "message")
    private String message;

    @Column(name = "sender_id", nullable = false)
    private UUID senderId;
    @Column(name = "receiver_id", nullable = false)
    private UUID receiverId;

    @Column(name = "read")
    private boolean read;

//    public Chat(UUID id, long timestamp, String message, UUID senderId, UUID receiverId) {
//        this.id = id;
//        this.timestamp = timestamp;
//        this.message = message;
//        this.senderId = senderId;
//        this.receiverId = receiverId;
//    }

    public Chat(UUID id, long timestamp, String message, UUID senderId, UUID receiverId, boolean read) {
        this.id = id;
        this.timestamp = timestamp;
        this.message = message;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.read = read;
    }

    public Chat() {

    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public UUID getSenderId() {
        return senderId;
    }

    public void setSenderId(UUID senderId) {
        this.senderId = senderId;
    }

    public UUID getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(UUID receiverId) {
        this.receiverId = receiverId;
    }
}
