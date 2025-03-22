import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { WinProduct } from "@/redux/slices/winProductSlice";
import { BetType } from "@/redux/slices/dailyBetSlice";

const BetHistoryScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [bets, setBets] = useState<BetType[]>([]);
  const [winRecords, setWinRecords] = useState<WinProduct[]>([]);
  const colorScheme = useColorScheme(); // Detects dark or light mode
  const [historyList, setHistoryList] = useState<(BetType | WinProduct)[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
        try {
            const storedBets = await AsyncStorage.getItem("betHistory");
            const storedWins = await AsyncStorage.getItem("winRecords");

            let bets: BetType[] = [];
            let wins: WinProduct[] = [];

            try {
                bets = storedBets ? JSON.parse(storedBets) : [];
                wins = storedWins ? JSON.parse(storedWins) : [];
            } catch (parseError) {
                console.error("❌ Error parsing stored history:", parseError);
            }

            // ✅ Extract date safely from Bet & WinProduct
            const getDate = (item: BetType | WinProduct) => {
              return new Date("winningDate" in item ? item.winningDate! : item.date!).getTime();
            };
          
            // ✅ Merge & sort
            const combined = [...bets, ...wins].sort((a, b) => getDate(b) - getDate(a));

            setHistoryList(combined);
        } catch (error) {
            Alert.alert("Error", error instanceof Error ? error.message : String(error));
        }
      };
      loadHistory();
  }, []);

  useEffect(() => {
    if (!params?.newBet && !params?.winData) return;
  
    const updateHistory = async () => {
      try {
        let newItem: BetType | WinProduct | null = null;
  
        if (params?.newBet && params.newBet !== "null") {
          const newBet: BetType = JSON.parse(Array.isArray(params.newBet) ? params.newBet[0] : params.newBet);
          newItem = newBet;
        }
  
        if (params?.winData && params.winData !== "null") {
          const newWin: WinProduct = JSON.parse(Array.isArray(params.winData) ? params.winData[0] : params.winData);
          newItem = newWin;
        }
  
        if (!newItem) return;
  
        // Fetch existing history
        const storedHistory = await AsyncStorage.getItem("historyList");
        const oldHistory: (BetType | WinProduct)[] = storedHistory ? JSON.parse(storedHistory) : [];
  
        // ✅ Sorting directly based on available date fields
        const updatedHistory = [newItem, ...oldHistory].sort(
          (a, b) => 
            new Date(("winningDate" in b ? b.winningDate : b.date) || 0).getTime() - 
            new Date(("winningDate" in a ? a.winningDate : a.date) || 0).getTime()
        );
  
        await AsyncStorage.setItem("historyList", JSON.stringify(updatedHistory));
        setHistoryList(updatedHistory);
  
        // ✅ Reset params to prevent reprocessing
        setTimeout(() => router.setParams({ newBet: null, winData: null }), 500);
      } catch (error) {
        Alert.alert("Error", error as string);
      }
    };
  
    updateHistory();
  }, [params?.newBet, params?.winData]);
  


  // ✅ Load bets from AsyncStorage when the screen opens
  useEffect(() => {
    const loadBets = async () => {
      try {
        const storedBets = await AsyncStorage.getItem("betHistory");
        if (storedBets) {
          setBets(JSON.parse(storedBets));
        }
      } catch (error) {
        Alert.alert("Error", error as string)
      }
    };

    const loadWinRecords = async () => {
      try {
        const storedWins = await AsyncStorage.getItem("winRecords");
        if (storedWins) {
          setWinRecords(JSON.parse(storedWins));
        }
      } catch (error) {
        Alert.alert("Error", error as string)
      }
    };

    loadBets();
    loadWinRecords();
  }, []);

  // ✅ Update bets if a new bet is added
  useEffect(() => {
    if (!params?.newBet && !params?.winData) { 
        return;  // ✅ Ignore if no new bet or win
    } 
    const updateBets = async () => {
        try {
            if (!params?.newBet || params.newBet === "null") return;

            const newBet: BetType = typeof params.newBet === "string" ? JSON.parse(params.newBet) : params.newBet;

            if (!newBet || typeof newBet.amount === "undefined" || !newBet.numbers) {
                console.error("❌ Invalid newBet object:", newBet);
                return;
            }

            newBet.amount = Number(newBet.amount);

            const storedBets = await AsyncStorage.getItem("betHistory");
            const oldBets: BetType[] = storedBets ? JSON.parse(storedBets) : [];

            const updatedBets = [newBet, ...oldBets];
            await AsyncStorage.setItem("betHistory", JSON.stringify(updatedBets));

            setBets(updatedBets); // ✅ Instantly update UI

            setTimeout(() => router.setParams({ newBet: null }), 500);
        } catch (error) {
          Alert.alert("Error", error as string)
        }
    };

    const updateWinRecords = async () => {
      try {
          if (!params?.winData || params.winData === "null") return; // ✅ Prevent processing if winData is missing
          // ✅ Ensure winData follows WinProduct structure
          const winData = typeof params.winData === "string"
              ? JSON.parse(params.winData)
              : params.winData;
  
          if (!winData || typeof winData !== "object" || !winData.id || !winData.product?.title) {
              console.error("❌ Invalid winData object:", winData);
              return; 
          }

  
          // ✅ Fetch existing win records
          const storedWins = await AsyncStorage.getItem("winRecords");
          const oldWins: WinProduct[] = storedWins ? JSON.parse(storedWins) : [];
  
          // ✅ Check for duplicates before adding
          if (!oldWins.some((win) => win.id === winData.id)) {
              const updatedWins: WinProduct[] = [winData, ...oldWins];
              await AsyncStorage.setItem("winRecords", JSON.stringify(updatedWins));
              setWinRecords(updatedWins); // ✅ Instantly update UI
          } else {
              console.warn("⚠️ Duplicate win detected, skipping save:", winData);
          }
  
          // ✅ Reset navigation param to avoid re-processing
          setTimeout(() => router.setParams({ winData: null }), 500);
          
      } catch (error) {
          Alert.alert("Error", error instanceof Error ? error.message : String(error));
      }
  };
    updateBets();
    updateWinRecords();
}, [params?.newBet, params?.newWin]); // ✅ Ensure both newBet and newWin trigger updates

  // ✅ Function to clear the bet history
  const clearHistory = async () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to delete all bets?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            await AsyncStorage.removeItem("betHistory");
            await AsyncStorage.removeItem("winRecords");
            await AsyncStorage.removeItem("historyList");
            setBets([]); // Clear state
            setWinRecords([]);
            setHistoryList([]);
          },
        },
      ]
    );
  };

  // ✅ Function to render combined list items
  const renderCombinedItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => {
        if (item.winOrLose === "Win") {
          router.push({
            pathname: "/win-product-deliver",
            params: { winData: JSON.stringify(item) },
          });
        }
      }}
      // style={[
      //   styles.betItem,
      //   item.winOrLose === "Win" ? styles.winItem : styles.betItemNormal,
      // ]}
       style={styles.betItem}
    >
      {item.amount && <Text style={styles.betText}>💰 Amount: ${item.amount}</Text>}
      {item.numbers && <Text style={styles.betText}>🎲 Numbers: {item.numbers}</Text>}
      {item?.product?.title && <Text style={styles.betText}>🎲 Title: {item?.product?.title}</Text>}
      {item?.deliveryStatus && <Text style={styles.betText}>🎲 Delivery: {item.deliveryStatus}</Text>}
      {item.date && <Text style={styles.betText}>📅 Date: {item.date}</Text>}
      {item.winningDate && <Text style={styles.betText}>📅 Date: {item.winningDate}</Text>}
      <Text style={[styles.betText, { color: item.status === "Active" ? "green" : "red" }]}>
        {/* {item.status === "win" ? "🏆 Win" : "🔥 Bet"} */}
        🔥 Status: {item.winOrLose === "Win" ? "🏆 Win" : "🔥 Bet"}
      </Text>
    </TouchableOpacity>
  );
  return (
    <LinearGradient colors={["white", "#37CDF0", "white"]} style={{ flex: 1 }}>
    <View style={styles.container}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      {/* ✅ Header */}
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
        <TouchableOpacity onPress={clearHistory} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>🗑 Clear</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ Merged List of Bets & Wins */}
      {historyList.length > 0 ? (
        <FlatList
          data={historyList}
          keyExtractor={(item) => item.id ?? `fallback-${Math.random().toString(36).substring(7)}`}
          renderItem={renderCombinedItem}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.noBetsText}>No history available.</Text>
      )}
    </View>
  </LinearGradient>
  );
};

export default BetHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  clearButton: {
    backgroundColor: "white",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    shadowColor: 'black'
  },
  clearButtonText: {
    color: "black",
    fontWeight: "bold",
  },
  listContainer: {
    paddingBottom: 20,
  },
  betItem: {
    backgroundColor: "white",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  betText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  betItemNormal: {
    backgroundColor: "#fcd5d4", // Light red for normal bets
    
  },
  winItem: {
    backgroundColor: "#e6fae9",
  },
  winText: {
    fontSize: 16,
    color: "#004085",
    marginBottom: 4,
  },
  noBetsText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
});