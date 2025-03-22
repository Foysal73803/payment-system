import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
// import { refreshUserData } from "@/services/api";
import { BetType, WinProduct, Transaction } from "@/types/types";

export interface User {
    userID: number | null;
    userName: string | null;
    contactNo: string | null;
    balance: number | null;
    bets: BetType[];
    winSpins: WinProduct[];
    transactions: Transaction[];
}

interface UserContextType {
    user: User | null;
    setUser: (user: User) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);
let stompClient: Client | null = null;

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    // // Connect to WebSocket
    // const connectWebSocket = (userID: number) => {
    //     if (!stompClient) {
    //         const socket = new SockJS("http://192.168.0.104:8080/ws");
    //         stompClient = new Client({
    //             webSocketFactory: () => socket, 
    //             reconnectDelay: 5000,
    //             onConnect: () => {
    //                 console.log("Connected to WebSocket");

    //                // Subscribe to transaction updates
    //                 stompClient?.subscribe(`/topic/transaction/${userID}`, (message) => {
    //                     console.log("Transaction message received:", message);
    //                     const transaction = JSON.parse(message.body);
    //                     console.log("New transaction received:", transaction);
    //                     console.log("user", user);


    //                     // setUser((prevUser) =>
    //                     //     prevUser
    //                     //         ? {
    //                     //             ...prevUser,
    //                     //             transactions: prevUser.transactions
    //                     //                 ? [transaction, ...prevUser.transactions]
    //                     //                 : [transaction],
    //                     //         }
    //                     //         : prevUser
    //                     // );
    //                     setUser((prevUser: any) => {
    //                         if (!prevUser) return prevUser;

    //                         const updatedUser = {
    //                             ...prevUser,
    //                             transactions: prevUser.transactions
    //                                 ? [transaction, ...prevUser.transactions]
    //                                 : [transaction],
    //                         }
    //                         updateUser(updatedUser);
    //                     });
    //                     console.log("user", user);
    //                 });

    //                 // Subscribe to balance updates
    //                 stompClient?.subscribe(`/topic/balance/${userID}`, (message) => {
    //                     console.log("Balance message received:", message);
    //                     const newBalance = JSON.parse(message.body);
    //                     console.log("New balance received:", newBalance);

    //                     // setUser((prevUser) =>
    //                     //     prevUser ? { ...prevUser, balance: newBalance } : prevUser
    //                     // );
    //                     setUser((prevUser) => {
    //                         if (!prevUser) return prevUser;
                            
    //                         const updatedUser = { ...prevUser, balance: newBalance };
    //                         updateUser(updatedUser);
    //                         return updatedUser;
    //                     });

    //                 });

    //                 // // Subscribe to bet updates
    //                 // stompClient?.subscribe(`/topic/bet/${userID}`, (message) => {
    //                 //     const bet = JSON.parse(message.body);
    //                 //     setUser((prevUser) =>
    //                 //         prevUser ? { ...prevUser, bets: [bet, ...prevUser.bets] } : prevUser
    //                 //     );
    //                 // });

    //                 // // Subscribe to win updates
    //                 // stompClient?.subscribe(`/topic/win/${userID}`, (message) => {
    //                 //     const winSpin = JSON.parse(message.body);
    //                 //     setUser((prevUser) =>
    //                 //         prevUser ? { ...prevUser, winSpins: [winSpin, ...prevUser.winSpins] } : prevUser
    //                 //     );
    //                 // });
    //             },
    //             onStompError: (error) => {
    //                 console.error("WebSocket Error:", error);
    //             },
    //         });

    //         stompClient.activate();
    //     }
    // };

    // useEffect(() => {
    //     const loadUserData = async () => {
    //         const storedUser = await AsyncStorage.getItem("user_info");
    //         if (storedUser) {
    //             const parsedUser = JSON.parse(storedUser);
    //             setUser(parsedUser);

    //             if (parsedUser.userID) {
    //                 connectWebSocket(parsedUser.userID);
    //             }
    //         }
    //     };
    //     loadUserData();

    //     return () => {
    //         stompClient?.deactivate();
    //     };
    // }, []);

    useEffect(() => {
        const loadUserData = async () => {
            const storedUser = await AsyncStorage.getItem("user_info");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
    
                // if (parsedUser.userID) {
                //     connectWebSocket(parsedUser.userID);
                //     // refreshUserData(); // Ensure latest data is loaded
                // }
            }
        };
    
        loadUserData();
    
        // return () => {
        //     stompClient?.deactivate();
        // };
    }, []);
    
 
    const logout = async () => {
        await AsyncStorage.multiRemove(["user_info", "access_token", "refresh_token"]);
        setUser(null);
        // stompClient?.deactivate();
        router.replace("/auth/sign-in");
    };
 
    const updateUser = async (updatedUser: User) => {
        setUser(updatedUser);
        await AsyncStorage.setItem("user_info", JSON.stringify(updatedUser));
    };

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};