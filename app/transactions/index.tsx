// import { FlatList, StyleSheet, Text, View, TouchableOpacity, Dimensions } from "react-native";
// import React, { useState, useEffect } from "react";
// import TransactionItem from "@/components/TransactionItem";
// import { LinearGradient } from "expo-linear-gradient";
// import { Colors } from "@/constants/Colors";
// import { AntDesign } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { TransactionType } from "@/redux/slices/transactionSlice";
// import { useUser } from "@/context/userManage";
// import { socketService } from "@/services/socket"; // Import STOMP WebSocket service

// const TransactionsScreen = () => {
//     const router = useRouter();
//     const { height } = Dimensions.get("window");
//     const { user } = useUser();
//     const [balance, setBalance] = useState(user?.balance || 0);
//     const [transactions, setTransactions] = useState<TransactionType[]>(user?.transactions || []);

//     useEffect(() => {
//         // Connect WebSocket and subscribe to updates
//         socketService.connect(() => {
//             socketService.subscribe("/topic/balanceUpdate", (message) => {
//                 const updatedBalance = JSON.parse(message.body);
//                 setBalance(updatedBalance);
//             });

//             socketService.subscribe("/topic/newTransaction", (message) => {
//                 const transaction: TransactionType = JSON.parse(message.body);
//                 setTransactions((prev) => [transaction, ...prev]);
//             });
//         });

//         return () => {
//             socketService.disconnect(); // Cleanup WebSocket connection on unmount
//         };
//     }, []);

//     return (
//         <View style={styles.container}>
//             <View style={styles.topContainer}>
//                 <LinearGradient
//                     colors={["#3DB6EF", "#37CDF0", "#3DB6EF"]}
//                     start={{ x: 1, y: 0 }}
//                     end={{ x: 1, y: 1 }}
//                     style={{ flex: 1 }}
//                 >
//                     <View style={{ flex: 1, padding: 20, paddingTop: 50 }}>
//                         <TouchableOpacity onPress={() => router.back()}>
//                             <AntDesign name="leftcircle" size={28} color="white" />
//                         </TouchableOpacity>
//                         <View style={{ alignItems: "center", paddingTop: 10 }}>
//                             <Text style={{ fontSize: 15, fontFamily: "outfit-bold", color: "white" }}>
//                                 Current Balance
//                             </Text>
//                             <Text style={{ fontSize: 28, fontFamily: "outfit-bold", color: "white" }}>
//                                 {balance} Taka
//                             </Text>
//                         </View>
//                     </View>
//                 </LinearGradient>
//             </View>
//             <View style={[styles.textContainer, { height: height - 230 }]}>
//                 <Text style={{ fontSize: 24, fontFamily: "outfit-bold", color: "black" }}>
//                     Transactions
//                 </Text>
//                 <FlatList
//                     data={transactions}
//                     renderItem={({ item }) => <TransactionItem item={item} />}
//                     keyExtractor={(item) => item.id!}
//                 />
//             </View>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "white",
//     },
//     topContainer: {
//         width: "100%",
//         height: 250,
//     },
//     textContainer: {
//         backgroundColor: Colors.WHITE,
//         marginTop: -20,
//         borderTopLeftRadius: 30,
//         borderTopRightRadius: 30,
//         padding: 15,
//         gap: 20,
//     },
// });

// export default TransactionsScreen;



import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useUser } from "@/context/userManage";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Transaction } from "@/types/types";
import TransactionItem from "@/components/TransactionItem";
import { stompService } from "@/services/socket";
const TransactionScreen = () => {
    const { height } = Dimensions.get("window");
    const router = useRouter();
    const { user } = useUser();
    const [transactions, setTransactions] = useState<Transaction[]>(user?.transactions || []);

    useEffect(() => {
        stompService.subscribeToTransactions((transaction: Transaction) => {
            console.log("Hello from transaction screen use effect");
            setTransactions((prev) => [...prev, transaction]);
        });
    }, [user?.transactions]);

        return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <LinearGradient
                    colors={["#3DB6EF", "#37CDF0", "#3DB6EF"]}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ flex: 1 }}
                >
                    <View style={{ flex: 1, padding: 20, paddingTop: 50 }}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <AntDesign name="leftcircle" size={28} color="white" />
                        </TouchableOpacity>
                        <View style={{ alignItems: "center", paddingTop: 10 }}>
                            <Text style={{ fontSize: 15, fontFamily: "outfit-bold", color: "white" }}>
                                Current Balance
                            </Text>
                            <Text style={{ fontSize: 28, fontFamily: "outfit-bold", color: "white" }}>
                                {user?.balance} Taka
                            </Text>
                        </View>
                    </View>
                </LinearGradient>
            </View>
            <View style={[styles.textContainer, { height: height - 230 }]}>
                <Text style={{ fontSize: 24, fontFamily: "outfit-bold", color: "black" }}>
                    Transactions
                </Text>
                <FlatList
                    data={transactions || []}
                    renderItem={({ item }) => <TransactionItem item={item} />}
                    keyExtractor={(item) => item.id!}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    topContainer: {
        width: "100%",
        height: 250,
    },
    textContainer: {
        backgroundColor: 'white',
        marginTop: -20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 15,
        gap: 20,
    },
});

export default TransactionScreen;
