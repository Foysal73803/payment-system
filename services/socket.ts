// import { io, Socket } from "socket.io-client";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// // Define your backend socket URL
// const SOCKET_URL = "http://192.168.0.104:8080/api"; // Replace with your backend server URL

// class SocketService {
//     private socket: Socket | null = null;

//     connect = async (token: string) => {
//         if (this.socket && this.socket.connected) {
//             console.log("Socket already connected");
//             return;
//         }

//         this.socket = io(SOCKET_URL, {
//             transports: ["websocket"],
//             query: { token }, // Send token for authentication
//           });

//         this.socket.on("connect", () => {
//             console.log("Connected to socket server");
//         });

//         this.socket.on("disconnect", () => {
//             console.log("Disconnected from socket server");
//         });

//         this.socket.on("error", (error) => {
//             console.error("Socket error:", error);
//         });

//         // Listen for new transactions and emit properly
//         this.socket.on("newTransaction", (transaction: any) => {
//             this.socket?.emit("newTransaction", transaction);  // ✅ Use this.socket instead of io
//         });

//         // Listen for balance update requests
//         this.socket.on("requestBalance", async (userId: string) => {
//             const updatedBalance = await this.getUpdatedBalance(userId);  // ✅ Fetch updated balance
//             this.socket?.emit("balanceUpdate", updatedBalance);  // ✅ Use this.socket instead of io
//         });
//     };

//     disconnect = () => {
//         if (this.socket) {
//             this.socket.disconnect();
//             this.socket = null;
//             console.log("Socket disconnected");
//         }
//     };

//     emit = (event: string, data: any) => {
//         this.socket?.emit(event, data);
//     };

//     on = (event: string, callback: (data: any) => void) => {
//         this.socket?.on(event, callback);
//     };

//     off = (event: string, callback?: (data: any) => void) => {
//         if (callback) {
//             this.socket?.off(event, callback);
//         } else {
//             this.socket?.off(event);
//         }
//     };

//     private async getAuthToken(): Promise<string | null> { 
//         return await AsyncStorage.getItem("access_token");
//     }
    

//     // ✅ Define getUpdatedBalance function (Mock function, replace with actual API call)
//     private async getUpdatedBalance(contactNo: string): Promise<number> {
//         try {
//             console.log("Fetching updated balance for user:", contactNo);
    
//             const response = await fetch(`http://192.168.0.104:8080/api/balance/${contactNo}`, {
//                 method: "GET",
//                 headers: {
//                     "Authorization": `Bearer ${this.getAuthToken()}`, // Include authentication token
//                     "Content-Type": "application/json"
//                 }
//             });
    
//             if (!response.ok) {
//                 throw new Error(`Failed to fetch balance: ${response.statusText}`);
//             }
    
//             const data = await response.json();
//             return data.balance;  // Assuming API returns { balance: number }
    
//         } catch (error) {
//             console.error("Error fetching balance:", error);
//             return 0;  // Return a fallback balance in case of an error
//         }
//     }
    
// }

// export const socketService = new SocketService();
// import { Client } from '@stomp/stompjs';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// class SocketService {
//     private client: Client | null = null;

//     connect = async () => {
//         const token = await AsyncStorage.getItem("access_token"); // Retrieve stored token

//         if (!token) {
//             console.error("❌ No JWT token found, WebSocket connection failed.");
//             return;
//         }

//         if (this.client && this.client.connected) {
//             console.log("✅ STOMP WebSocket already connected");
//             return;
//         }

//         this.client = new Client({
//             brokerURL: 'ws://192.168.0.104:8080/ws',
//             connectHeaders: {
//                 Authorization: `Bearer ${token}`  // Send token for authentication
//             },
//             onConnect: () => {
//                 console.log("✅ Connected to WebSocket");

//                 this.client?.subscribe('/topic/newTransaction', (message) => {
//                     console.log('🔄 New transaction:', JSON.parse(message.body));
//                 });

//                 this.client?.subscribe('/topic/balanceUpdate', (message) => {
//                     console.log('💰 Balance updated:', JSON.parse(message.body));
//                 });
//             },
//             onDisconnect: () => console.log("❌ Disconnected from WebSocket"),
//             onWebSocketError: (error) => console.error("⚠️ WebSocket Error:", error),
//             onStompError: (error) => console.error("⚠️ STOMP Error:", error),
//         });

//         this.client.activate();
//     };

//     disconnect = () => {
//         if (this.client) {
//             this.client.deactivate();
//             this.client = null;
//             console.log("❌ WebSocket disconnected");
//         }
//     };

//     send = (destination: string, body: any) => {
//         if (this.client && this.client.connected) {
//             this.client.publish({ destination, body: JSON.stringify(body) });
//         }
//     };
// }

// export const socketService = new SocketService();



// // Backend Socket.IO Setup
// // Ensure your backend is emitting events like:

// // io.emit("balanceUpdate", newBalance);
// // io.emit("newTransaction", newTransaction);


import { Client } from '@stomp/stompjs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SockJS from 'sockjs-client';
import { isAccessTokenValid, refreshToken } from "@/services/api";
class StompService {
    private token: string | null = null;
    private client: Client;
    private socket: any;
    private isConnected: boolean = false;

    constructor() {
        this.initializeToken();
        this.socket = new SockJS("http://192.168.0.104:8080/ws");
        this.client = new Client({
            webSocketFactory: () => this.socket,
            reconnectDelay: 5000,
            connectHeaders: {
                Authorization: `Bearer ${this.token}`
            },
            onConnect: () => {
                console.log("✅ Connected to WebSocket");
                this.isConnected = true;  // Mark as connected
            },
            onDisconnect: () => {
                console.log("❌ Disconnected from WebSocket");
                this.isConnected = false; // Mark as disconnected
            },
            onStompError: (error) => {
                console.error("🚨 STOMP Error:", error);
            },
        });

        this.client.activate();
    }

    async initializeToken() {
        this.token = !isAccessTokenValid() ? await AsyncStorage.getItem("access_token") : await refreshToken();
        console.log("🔑 Loaded Token:", this.token);
    }

    sendTransaction(senderNo: string, receiverId: string, amount: number) {
        console.log("🔄 Attempting to send transaction...");

        if (!this.client && !this.isConnected){
            console.error("❌ WebSocket is not connected.");
            return;
        }
        
        const transactionData = {
            senderNo,
            receiverId,
            amount,
        };

        this.client.publish({
            destination: "/app/newTransaction",
            body: JSON.stringify(transactionData),
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        });

        console.log("✅ Transaction sent via WebSocket:", transactionData);
    }

    subscribeToTransactions(callback: (transaction: any) => void) {
        if (this.client) {
            this.client.subscribe("/topic/transactions", (message) => {
                const data = JSON.parse(message.body);
                console.log("🔔 Received transaction update:", data);
                callback(data);
            });
        }
    }
}

export const stompService = new StompService();
