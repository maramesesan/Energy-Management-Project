package ds2024.dtos;

import java.util.UUID;

public class ChatDTO {

    private UUID id;
    private long timestamp;
    private UUID sender_id;
    private UUID receiver_id;
    private String message;
    private Boolean read;

    public ChatDTO() {
    }

    public ChatDTO(UUID id, long timestamp, UUID sender_id, UUID receiver_id, String message, boolean read) {
        this.id = id;
        this.timestamp = timestamp;
        this.sender_id = sender_id;
        this.receiver_id = receiver_id;
        this.message = message;
        this.read = read;
    }

    public Boolean getRead() {
        return read;
    }

    public void setRead(Boolean read) {
        this.read = read;
    }

    public UUID getId() {
        return id;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public UUID getSender_id() {
        return sender_id;
    }

    public UUID getReceiver_id() {
        return receiver_id;
    }

    public String getMessage() {
        return message;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public void setSender_id(UUID sender_id) {
        this.sender_id = sender_id;
    }

    public void setReceiver_id(UUID receiver_id) {
        this.receiver_id = receiver_id;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
