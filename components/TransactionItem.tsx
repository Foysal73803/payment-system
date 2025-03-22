import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Transaction } from "@/types/types";

const TransactionItem = ({ item }: { item: Transaction }) => {
    const isWithdraw = item.purpose === "Withdraw";
    const indicatorColor = isWithdraw ? "#FF4D4D" : "#28A745";
    const bgColor = isWithdraw ? "#FFEBEB" : "#E6FBE7";
    const textColor = isWithdraw ? "#C62828" : "#1B5E20";
    const sign = isWithdraw ? "−" : "+";

    return (
        <View style={styles.card}>
            {/* Left Indicator Circle */}
            <View style={[styles.indicator, { backgroundColor: indicatorColor }]} />

            {/* Transaction Details */}
            <View style={[styles.content, { backgroundColor: bgColor }]}>
                <View>
                    <Text style={[styles.title, { color: textColor }]}>{item.title}</Text>
                    <Text style={styles.date}>{item.localDateTime}</Text>
                </View>
                <Text style={[styles.amount, { color: textColor }]}>
                    {sign} {item.amount} Taka
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 8,
        padding: 10,
        borderRadius: 15,
        backgroundColor: "#FFF",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    indicator: {
        width: 14,
        height: 14,
        borderRadius: 7,
        marginRight: 10,
    },
    content: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        borderRadius: 12,
    },
    title: {
        fontSize: 16,
        fontFamily: "outfit-medium",
    },
    date: {
        fontSize: 12,
        color: "#757575",
        fontFamily: "outfit",
    },
    amount: {
        fontSize: 18,
        fontFamily: "outfit-bold",
    },
});

export default TransactionItem;
