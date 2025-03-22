import React, { useState } from "react";
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    ActivityIndicator, 
    Alert, 
    ToastAndroid, 
    StyleSheet, 
    Image, 
    useColorScheme, 
    StatusBar 
} from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@/context/userManage";
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors'
import { login } from "@/services/api";
const LoginScreen = () => {
    const router = useRouter();
    const colorScheme = useColorScheme(); // Detects dark or light mode
    const [contactNo, setContactNo] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { setUser } = useUser();

    const handleLogin = async () => {
        if (!contactNo || !password) {
            Alert.alert("Error", "Please enter both Phone Numeber and password.");
            return;
        }

        setLoading(true);

        try {
            const user_info = await login(contactNo, password);
            setUser(user_info);
            ToastAndroid.show("Login Successful", ToastAndroid.SHORT);           

            router.replace("/(tabs)/homepage");
        } catch (error) {
            ToastAndroid.show("Login Failed", ToastAndroid.SHORT);
        } finally {
            setLoading(false);
        }
    };
    // style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}
    return (
        <View style={{ flex: 1}}>
            <StatusBar
                backgroundColor={colorScheme === "dark" ? "light" : "dark"}
                // backgroundColor={colorScheme === "dark" ? "#121212" : "#f5f5f5"}
            />
            <View style={styles.topContainer}>
                <LinearGradient  
                    colors={['white', '#3DB6EF', 'white']}
                    start={{x: 1, y: 0}}
                    end={{x: 1, y: 1}}
                    style={{flex: 1}}   
                >
                    <Image style={styles.imageStyle} source={require('@/assets/images/fortune.png')} />
                </LinearGradient>
            </View>
            <View style={styles.textContainer}>
                <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Login</Text>

                <TextInput
                    placeholder="Phone Number"
                    value={contactNo}
                    onChangeText={setContactNo}
                    keyboardType="number-pad"
                    style={{ width: "100%", padding: 10, borderWidth: 1, borderRadius: 5, marginBottom: 10 }}
                />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={{ width: "100%", padding: 10, borderWidth: 1, borderRadius: 5, marginBottom: 10 }}
                />

                <TouchableOpacity onPress={handleLogin} style={{ backgroundColor: "#007bff", padding: 12, borderRadius: 5, width: "100%", alignItems: "center" }}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff", fontSize: 16 }}>Login</Text>}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/auth/sign-up")} style={{ marginTop: 10 }}>
                    <Text style={{ color: "#007bff" }}>Don't have an account? Register</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    topContainer: {
        width: '100%',
        height: 500
    },
    imageStyle: {
        width: '100%',
        height: 400,
        marginTop: 50
    },
    textContainer: {
        flex: 1, 
        justifyContent: "center",
         alignItems: "center",
        backgroundColor: 'white',
        marginTop: -20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: '100%',
        padding: 15,
        gap: 20
    },
});

export default LoginScreen;
