import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Alert,
  useColorScheme,
  ToastAndroid
} from "react-native";
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Transaction } from "@/types/types";
import { useRouter } from "expo-router";
import { User, useUser } from '@/context/userManage';
import { stompService } from "@/services/socket";
import api, { balanceTrnsfer, isAccessTokenValid, refreshToken } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TransferScreen = () => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const [receiverId, setReceiverId] = useState("");
    const [amount, setAmount] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user, setUser} = useUser();

    useEffect(() => {
        // if (!user?.userID) return;

        // const transactionSubscription = stompService.subscribe(`/topic/transaction/${user.userID}`, (message) => {
        //     const transaction: Transaction = JSON.parse(message.body);
        //     console.log("New transaction received:", transaction);
        //     ToastAndroid.show(`New transaction: ${transaction.amount} Taka`, ToastAndroid.SHORT);
        // });

        // return () => {
        //     transactionSubscription?.unsubscribe();
        // };
    }, [user]);

    const handleTransfer = () => {
        if (!receiverId || !amount) {
            Alert.alert("Error", "Please enter both User ID and Amount.");
            return;
        }
        const amountValue = Number(amount);
        if (isNaN(amountValue) || amountValue < 10) {
            Alert.alert("Error", "Minimum transfer amount is 10.");
            return;
        }
        setModalVisible(true);
    };

    const confirmTransfer = async () => {
        setLoading(true);
    
        if (isNaN(amount) || amount <= 0) {
            ToastAndroid.show("Please enter a valid amount!", ToastAndroid.SHORT);
            setModalVisible(false);
            setLoading(false);
            return;
        }
    
        try {
            if(!isAccessTokenValid()) {
                refreshToken();
                setLoading(false);
            }
            const access_token = await AsyncStorage.getItem("access_token");
            console.log("Starting transfer...");

            const response = await balanceTrnsfer(access_token, receiverId, amount, "TRANSFER")


            console.log("Response from Transfer Screen:", response.data);

            if(response.status !== 200) {
                ToastAndroid.show("Balance transfer failed", ToastAndroid.SHORT);
                setLoading(false);
                return;
            }

            ToastAndroid.show("Balance transferred successfully", ToastAndroid.SHORT);

            if (user?.contactNo) {
                stompService.sendTransaction(user.contactNo, `+88${receiverId}`, amount);
            } else {
                console.error("User contact number is missing.");
            }
    
            router.replace("/transactions");
        } catch (error) {
            ToastAndroid.show("Transfer failed! Please try again.", ToastAndroid.SHORT);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <LinearGradient
            colors={['white', '#37CDF0', 'white']}
            start={{ x: 1, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
        >
            <View style={styles.container}>
                <StatusBar
                    style={colorScheme === "dark" ? "light" : "dark"}
                    backgroundColor={colorScheme === "dark" ? "#121212" : "#f5f5f5"}
                />
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <FontAwesome6 name="circle-arrow-left" size={34} color="#3DB6EF" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Transfer Balance</Text>
                </View>

                {/* Input Fields */}
                <TextInput
                    style={styles.input}
                    placeholder="Enter User ID"
                    value={receiverId}
                    onChangeText={setReceiverId}
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Enter Amount"
                    value={amount.toString()}
                    onChangeText={(text) => setAmount(Number(text))}
                    keyboardType="numeric"
                />

                {/* Transfer Button */}
                <TouchableOpacity style={styles.transferButton} onPress={handleTransfer}>
                    <Text style={styles.transferButtonText}>Send</Text>
                </TouchableOpacity>

                {/* Confirmation Modal */}
                <Modal visible={modalVisible} transparent animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>Confirm Transfer</Text>
                            <Text style={styles.modalDetails}>
                                Send {amount} Taka to User ID {receiverId}?
                            </Text>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.cancelText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.confirmButton}
                                    onPress={confirmTransfer}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={styles.confirmText}>Confirm</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 25, marginBottom: 40 },
    title: { fontSize: 20, fontWeight: "bold", textAlign: "center" },
    input: { borderWidth: 1, borderColor: "#ddd", padding: 10, marginVertical: 10, borderRadius: 5, backgroundColor: "#fff" },
    transferButton: { backgroundColor: "#4CAF50", padding: 15, alignItems: "center", borderRadius: 5, marginTop: 10 },
    transferButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

    // Modal Styles
    modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
    modalContent: { width: "80%", backgroundColor: "#fff", padding: 20, borderRadius: 10, alignItems: "center" },
    modalText: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
    modalDetails: { fontSize: 16, marginBottom: 20 },
    modalButtons: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
    cancelButton: { padding: 10, flex: 1, alignItems: "center", backgroundColor: "#ccc", borderRadius: 5, marginRight: 10 },
    confirmButton: { padding: 10, flex: 1, alignItems: "center", backgroundColor: "#4CAF50", borderRadius: 5 },
    cancelText: { fontSize: 16, color: "#333" },
    confirmText: { fontSize: 16, color: "#fff" },
});

export default TransferScreen;
