import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import { DatePicker, Button } from 'antd';
import 'antd/dist/reset.css';
import '../styles/WebSocket.css';



function WebSocket({ selectedDeviceId }) {
    const [messages, setMessages] = useState([]); 
    const [energyData, setEnergyData] = useState([]); 
    const [selectedDate, setSelectedDate] = useState(null); 
    // const [deviceId, setDeviceId] = useState(''); 
    let stompClient = null;

    const connect = () => {
        const socket = new SockJS('http://monitoring1.localhost/ws');
        stompClient = new Client({
            webSocketFactory: () => socket,
            debug: console.log,
            onConnect: () => {
                console.log('Connected');
                subscribeToTopic();
            },
            onStompError: (frame) => console.error('Error:', frame),
        });

        stompClient.activate();
    };

    useEffect(() => {
        if (selectedDeviceId) {
            connect();
        }
        return () => {
            if (stompClient) stompClient.deactivate();
        };
    }, [selectedDeviceId]);

    const subscribeToTopic = () => {
        if (stompClient) {
            stompClient.subscribe(`/topic/alerts/${selectedDeviceId}`, (message) => {
                const receivedMessage = message.body;
                addMessage(receivedMessage);
            });
        }
    };

    const addMessage = (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
    };

    const convertToTimestamp = (dateString) => {
        return new Date(dateString).getTime();
    };

    const formatDataForChart = (data) => {
        return data.map((item) => ({
            hour: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            value: item.measurement_value, 
        }));
    };
    
    
    const fetchEnergyData = async () => {
        const timestamp = convertToTimestamp(selectedDate);
        console.log(timestamp);
    
        try {
            const response = await fetch(`http://monitoring1.localhost/details/${timestamp}/${selectedDeviceId}`, { method: 'GET' });
            if (!response.ok) throw new Error('Failed to fetch energy data');
            
            const data = await response.json();
            const formattedData = formatDataForChart(data);
            setEnergyData(formattedData);
        } catch (error) {
            console.error(error);
        }
    };
    

    const handleDateChange = (date, dateString) => {
        console.log(dateString);
        setSelectedDate(dateString);
    };

    

    return (
        <div>
            <h1>WebSocket Monitoring Test</h1>
            <div className='messages_container'>
                <h2>Received Messages</h2>
                <div id="messages">
                    {messages.length > 0 ? (
                        messages.map((msg, index) => (
                            <p key={index}>{msg}</p>
                        ))
                    ) : (
                        <p><em>Waiting for message...</em></p>
                    )}
                </div>
            </div>
    
            <div>
                <h2>Energy Consumption</h2>
                <div className='inputs'>
                    <DatePicker onChange={handleDateChange} />
                    <Button type="primary" onClick={fetchEnergyData}>
                        Fetch Data
                    </Button>
                </div>
    
                {energyData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={energyData}>
                            <CartesianGrid/>
                            <XAxis dataKey="hour" label={{ value: 'Hour', position: 'insideBottom', offset: -5 }} />
                            <YAxis label={{ value: 'Energy', angle: -90, position: 'insideLeft' }} />
                            <Legend />
                            <Line type="monotone" dataKey="value" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <p><em>No data available.</em></p>
                )}
            </div>
        </div>
    );
}    
export default WebSocket;
