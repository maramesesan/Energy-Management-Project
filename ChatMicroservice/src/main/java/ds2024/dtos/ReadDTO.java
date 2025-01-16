package ds2024.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class ReadDTO {
    private UUID senderId;
    private UUID receiverId;
    private String read;
}

