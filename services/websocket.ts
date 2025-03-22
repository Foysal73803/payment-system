import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const socketUrl = "http://localhost:8080/ws"; // Replace with your WebSocket server URL

const stompClient = new Client({
  webSocketFactory: () => new SockJS(socketUrl),
  reconnectDelay: 5000, // Auto-reconnect after 5 seconds
  onConnect: () => console.log("Connected to WebSocket"),
  onStompError: (frame) => console.error("STOMP Error:", frame),
});

stompClient.activate();

export default stompClient;
