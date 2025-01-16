import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import '../styles/Chat.css';
import { getMessages } from "../services/chatService";

function Chat({ senderId }) {
    const [isOpen, setIsOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const selectedUserRef = useRef(null); 
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [stompClient, setStompClient] = useState(null);
    const [typingStatus, setTypingStatus] = useState(null);


    const connect = () => {
        const client = new Client({
            webSocketFactory: () => new SockJS('http://chat.localhost/ws'),
            debug: (str) => console.log(str),
            onConnect: () => {
                console.log('Connected to WebSocket');
                setStompClient(client);
            },
            onDisconnect: () => {
                console.log('Disconnected from WebSocket');
                setStompClient(null);
            },
            onStompError: (frame) => {
                console.error('STOMP error:', frame);
            },
        });

        client.activate();
    };

    

    const subscribeToTopic = (client, receiverId) => {
        if (client && client.connected) {
            const subscription = client.subscribe('/topic/messages', async (message) => {
                const receivedMessage = JSON.parse(message.body);
                const currentSelectedUser = selectedUserRef.current;
    
                if (receivedMessage.receiver_id === senderId && receivedMessage.sender_id === currentSelectedUser?.id) {
                    setMessages((prev) => [...prev, { ...receivedMessage, type: 'received' }]);
                }
            });
    
            return subscription;
        }
    };

    const subscribeToReadTopic = (receiverId) => {
        if (stompClient) {
            stompClient.subscribe(`/topic/notifications/read/${senderId}/${receiverId}`, (message) => {
                try {
                    const receivedMessage = JSON.parse(message.body);
                    if (receivedMessage.status === 'read') { 
                        setMessages((prev) =>
                            prev.map((msg) =>
                                msg.receiver_id === receiverId ? { ...msg, read: true } : msg
                            )
                        );
                    }
                } catch (error) {
                    console.error("Error parsing message:", error);
                }
            });
        }
    };

    const subscribeToTypingTopic = (receiverId) => {
        if (stompClient) {
            stompClient.subscribe(`/topic/notifications/typing/${senderId}/${receiverId}`, (message) => {
                const receivedMessage = JSON.parse(message.body);
                if (receivedMessage.status === "typing") {
                    setTypingStatus(true);
                    setTimeout(() => setTypingStatus(false), 2000);
                }
            });
        }
    };
    
    
    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://user.localhost/person', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching persons:', error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
            if (!stompClient) {
                connect();
            } else if (selectedUser) {
                stompClient.publish({
                    destination: '/app/read',
                    body: JSON.stringify({ senderId: selectedUser.id, receiverId: senderId })
                });
            }
        }
        return () => {
            if (stompClient) {
                stompClient.deactivate();
            }
        };
    }, [isOpen, selectedUser]);
    

    const handleUserChange = async (event) => {
        const userId = event.target.value;
        const user = users.find((u) => u.id === userId);
        setSelectedUser(user);
        selectedUserRef.current = user;
    
        if (user) {
            try {
                const receivedMessages = await getMessages(senderId, user.id);
                const sentMessages = await getMessages(user.id, senderId);
    
                const allMessages = [
                    ...sentMessages.map((msg) => ({ ...msg, type: 'sent' })),
                    ...receivedMessages.map((msg) => ({ ...msg, type: 'received', read: true })),
                ];
                allMessages.sort((a, b) => a.timestamp - b.timestamp);
                setMessages(allMessages);
    
                if (!stompClient || !stompClient.connected) {
                    console.warn('STOMP client not connected, attempting to reconnect...');
                    await new Promise((resolve) => {
                        const tempClient = connect(); 
                        tempClient.onConnect = resolve;
                    });
                }
    
                stompClient.publish({
                    destination: '/app/read',
                    body: JSON.stringify({ senderId: user.id, receiverId: senderId })
                });
    
                subscribeToTopic(stompClient, user.id);
                subscribeToReadTopic(user.id);
                subscribeToTypingTopic(user.id);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        }
    };

    const handleChatBoxClick = () => {
        if (selectedUser && stompClient && stompClient.connected) {
            stompClient.publish({
                destination: '/app/read',
                body: JSON.stringify({ senderId: selectedUser.id, receiverId: senderId })
            });
            subscribeToReadTopic(selectedUser.id);
        }
    };

    const handleTyping = () => {
        if (selectedUser && stompClient && stompClient.connected) {
            stompClient.publish({
                destination: '/app/typing',
                body: JSON.stringify({ senderId: selectedUser.id, receiverId: senderId })
            });
            subscribeToTypingTopic(selectedUser.id);

        }
    };
    


    const handleSendMessage = async (e) => {
        e.preventDefault();
    
        if (stompClient && stompClient.connected && message.trim() && selectedUser) {
            const chatMessage = {
                id: undefined,
                timestamp: Date.now(),
                sender_id: senderId,
                receiver_id: selectedUser.id,
                message: message.trim(),
                read: false,
            };
    
            try {
                stompClient.publish({
                    destination: '/app/sendMessage',
                    body: JSON.stringify(chatMessage),
                });
    
                setMessages((prev) => [...prev, { ...chatMessage, type: 'sent' }]);
                setMessage("");
            } catch (error) {
                console.error('Error sending message:', error);
            }
        } else {
            console.error('STOMP client not connected');
        }
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

   

    return (
        <div>
            <button className="open-chat-btn" onClick={toggleChat}>
                {isOpen ? "Close Chat" : "Open Chat"}
            </button>

            {isOpen && (
                <div className="chat-popup" >
                    <div className="chat-header">
                        <h2>Chat</h2>
                    </div>

                    <div className="chat-body">
                        <label id="label-select">Select a user to chat with:</label>
                        <select
                            id="user-select"
                            onChange={handleUserChange}
                            value={selectedUser ? selectedUser.id : ""}
                        >
                            <option value="" disabled>Choose a user</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>{user.username}</option>
                
                            ))
                            
                            }
                        </select>

                        <div className="message-container" onClick={handleChatBoxClick}>
                            {messages.map((msg, index) => (
                              <div 
                              key={index}
                              className={`message ${msg.type === 'sent' ? 'message-sent' : 'message-received'}`}>
                              <p>{msg.message}</p>
                              <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
                              {msg.type === 'sent' && msg.read && <small className="read-indicator">✓ Read</small>}
                          </div>
                          
                            ))}

                            {typingStatus && <small className="typing">Typing...</small>}
                        </div>
                    </div>

                    <form className="form-container" onSubmit={handleSendMessage} onChange={handleTyping}>
                        <textarea
                            placeholder="Type message..."
                            name="msg"
                            value={message}
                            onChange={(e) => {
                                setMessage(e.target.value);
                            }}
                            required
                        ></textarea>

                        <div className="button-group">
                            <button type="submit" className="btn">Send</button>
                            <button type="button" className="btn-cancel" onClick={toggleChat}>Close</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Chat;
