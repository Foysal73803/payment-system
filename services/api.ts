import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const api = axios.create({
    baseURL: "http://192.168.0.104:8080/api",
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // Ensures cookies are sent
});

export const login = async (contactNo: string, password: string) => {
    try {
        const response = await api.post("/auth/login", { 
            contactNo: `+88${contactNo}`, 
            password: password 
        });

        const { access_token, access_token_expiry, user_info_response } = response.data;
        // Store tokens securely

        const access_token_expiry_timestamp = new Date().getTime() + access_token_expiry;
        await AsyncStorage.setItem("access_token_expiry", access_token_expiry_timestamp.toString());
        
        await AsyncStorage.setItem("access_token", access_token);

        const cookies = response.headers["set-cookie"];
        if (cookies) {
            // Find the refresh_token inside cookies
            const refreshTokenCookie = cookies.find(cookie => cookie.startsWith("refresh_token="));
            if (refreshTokenCookie) {
                const refresh_token = refreshTokenCookie.split(";")[0].split("=")[1]; // Extract token value    
                // Store refresh token securely
                await AsyncStorage.setItem("refresh_token", refresh_token);
            }
        } else {
            console.warn("No cookies received from server.");
        }
        await AsyncStorage.setItem("user_info", JSON.stringify(user_info_response));
        return user_info_response;
        
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
};

export const refreshToken = async () => {
    try {
        const refreshToken = await AsyncStorage.getItem("refresh_token");

        if (!refreshToken) {
            console.warn("No refresh token found");
            return null;
        }

        const response = await api.post(
            "/auth/refresh-token",
            {}, // Empty body
            {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${refreshToken}`,
                },
            }
        );

        const { access_token } = response.data;

        // Store the new access token
        await AsyncStorage.setItem("access_token", access_token);

        return access_token;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Refresh token failed", error.response?.data || error.message);
        } else {
            console.error("Refresh token failed", error);
        }
        return null;
    }
};

export const balanceTrnsfer = async (access_token: string | null, receiverNo: string, amount: number, transactionType: string) => {
    const response = await api.post(
                    "/user/makeUserTransaction",
                    {
                        amount: amount,
                        receiverNo: `+88${receiverNo}`,
                        transactionType: transactionType,
                    },
                    {
                        withCredentials: true,
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                        },                                      
                });
    return response;
};

// export const refreshUserData = async () => {
//     try {
//         const { updateUser } = useUser();
//         const response = await api.get("/user/getUserInfo", {
//             headers: {
//                 Authorization: `Bearer ${await AsyncStorage.getItem("access_token")}`, // Attach access token
//             },
//         }); // Adjust API endpoint
//         const updatedUser = response.data;

//         updateUser(updatedUser); // Store new user data in state and AsyncStorage
//     } catch (error) {
//         console.error("Error refreshing user data:", error);
//     }
// };

export const isAccessTokenValid = async () => {
    try {  
        const expiryTimestamp = await AsyncStorage.getItem("access_token_expiry");
        if (expiryTimestamp) {
            const currentTimestamp = new Date().getTime();
            const status: boolean = currentTimestamp < parseInt(expiryTimestamp);
            console.log("Access token expiry status:", status);
            return status;
        }
        return true; // If expiry timestamp is not found, consider it expired
    } catch (error) {
        console.error("Error checking token expiry:", error);
        return true; // In case of error, consider it expired
    }
}

export default api;
