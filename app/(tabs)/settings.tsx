import { View, Text, TouchableOpacity, ScrollView, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from 'expo-router';
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { useUser } from '@/context/userManage';
 
type MaterialIconsNames = keyof typeof MaterialIcons.glyphMap;

interface Params {
    icon: MaterialIconsNames;
    text: string;
    action: () => void;
}

export default function Settings() {
    const { user, logout } = useUser();
    const router = useRouter();
    const colorScheme = useColorScheme(); // Detects dark or light mode
    const navigateToEditProfile = () => router.push('/updateProfile');
    const navigateToSecurity = () => console.log("Security Function");
    const navigateToNotifications = () => console.log("Notifications Function");
    const navigateToPrivacy = () => console.log("Privacy Function");
    const navigateToSupport = () => router.push('/help-support');
    const navigateToTermsAndPolicies = () => router.push('/terms-policies');
    const navigateToFreeUpSpace = () => console.log("Free Up Space");
    const navigateToDataSaver = () => console.log("Data Saver");
    const navigateToReportProblem = () => router.push('/report-problem');
    const addAccount = () => router.push('/add-account');

    const accountItems: Params[] = [
        { icon: "person-outline", text: "Edit Profile", action: navigateToEditProfile },
        { icon: "security", text: "Security", action: navigateToSecurity },
        { icon: "notifications-none", text: "Notifications", action: navigateToNotifications },
        { icon: "lock-outline", text: "Privacy", action: navigateToPrivacy }
    ];

    const supportItems: Params[] = [
        { icon: "help-outline", text: "Help & Support", action: navigateToSupport },
        { icon: "info-outline", text: "Terms and Policies", action: navigateToTermsAndPolicies }
    ];

    const cacheAndCellularItems: Params[] = [
        { icon: "delete-outline", text: "Free up space", action: navigateToFreeUpSpace },
        { icon: "save-alt", text: "Data Saver", action: navigateToDataSaver }
    ];

    const actionsItems: Params[] = [
        { icon: "outlined-flag", text: "Report a problem", action: navigateToReportProblem },
        { icon: "people-outline", text: "Add Account", action: addAccount },
        { icon: "exit-to-app", text: "Log out", action: logout } // ✅ Replaced "logout" with "exit-to-app"
    ];

    const renderSettingsItem = (paramInfo: Params) => (
        <TouchableOpacity
            onPress={paramInfo.action}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
                paddingHorizontal: 15,
                backgroundColor: '#f0f0f0',
                borderRadius: 10,
                marginVertical: 4 // Add spacing between items
            }}
        >
            <MaterialIcons name={paramInfo.icon} size={24} color="black" />
            <Text style={{
                marginLeft: 20,
                fontFamily: "outfit-medium",
                fontSize: 16,
                color: "#333"
            }}>
                {paramInfo.text}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={{ flex: 1, marginBottom: 60}}>
            <StatusBar style={colorScheme === "dark" ? "light" : "dark"} backgroundColor={colorScheme === "dark" ? "#121212" : "#f5f5f5"} />
            <View style={{
                paddingVertical: 15,
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: "#ddd"
            }}>
                <Text style={{ fontSize: 22, fontFamily: 'outfit-bold' }}>Settings</Text>
            </View>

            <ScrollView style={{ paddingHorizontal: 15, marginTop: 10, backgroundColor: 'white'}}>
                {[
                    { title: "Account", items: accountItems },
                    { title: "Support & About", items: supportItems },
                    { title: "Cache and Cellular", items: cacheAndCellularItems },
                    { title: "Actions", items: actionsItems }
                ].map((section, index) => (
                    <View key={index} style={{ marginBottom: 20 }}>
                        <Text style={{
                            fontSize: 19,
                            fontFamily: 'outfit-bold',
                            marginBottom: 10
                        }}>
                            {section.title}
                        </Text>
                        <View style={{ borderRadius: 12 }}>
                            {section.items.map((item, itemIndex) => (
                                <React.Fragment key={itemIndex}>
                                    {renderSettingsItem(item)}
                                </React.Fragment>
                            ))}
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
