import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { refreshToken, isAccessTokenValid } from "@/services/api";
import { stompService } from "@/services/socket";

const Index = () => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = await AsyncStorage.getItem("access_token");

            if (!token) {
                setIsAuthenticated(false);
                // stompService.disconnect();
                return;
            }

            try {
                const isValid = await isAccessTokenValid();
                if (isValid) {
                    setIsAuthenticated(true);
                    // stompService.connect();
                } else {
                    const newToken = await refreshToken();
                    if (newToken) {
                        await AsyncStorage.setItem("access_token", newToken);
                        // stompService.connect();
                        setIsAuthenticated(true);
                    } else {
                        setIsAuthenticated(false);
                        // stompService.disconnect();
                    }
                }
            } catch (error) {
                Alert.alert("Login Failed", "Something went wrong.");
            }
        };

        checkLoginStatus();
    }, []);

    useEffect(() => {
        if (isAuthenticated !== null) {
            router.replace(isAuthenticated ? "/(tabs)/homepage" : "/auth/sign-in");
        }
    }, [isAuthenticated]);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    );
};

export default Index;
