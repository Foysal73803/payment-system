import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from 'expo-linear-gradient';

export default function RouletteScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme(); // Detects dark or light mode

  return (
    <LinearGradient
        colors={['white', '#37CDF0', 'white']}
                        start={{x: 1, y: 0}}
                        end={{x: 1, y: 1}}
                        style={{flex: 1}}
        
        >
    <View style={styles.container}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} backgroundColor={colorScheme === "dark" ? "#121212" : "#f5f5f5"} />
      <Text style={styles.title}>Roulette Games</Text>

      {/* Instant Win */}
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => router.push("/instant-win")}
      >
        <Text style={styles.optionText}>Instant Spin to Win</Text>
      </TouchableOpacity>

      {/* Daily Bet Spin */}
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => router.push("/daily-bet")}
      >
        <Text style={styles.optionText}>Place Bet for Daily Spin</Text>
      </TouchableOpacity>
    </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center"},
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  optionButton: { backgroundColor: "white", padding: 15, margin: 10, borderRadius: 10, width: "80%", alignItems: "center" },
  optionText: { color: "black", fontSize: 18, fontWeight: "bold" },
});
