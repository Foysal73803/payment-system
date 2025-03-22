import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Image, View,Text, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function transaction () {
    const colorScheme = useColorScheme(); // Detects dark or light mode

    return (
        <SafeAreaView style={{
            flex: 1
        }}>
            <StatusBar style={colorScheme === "dark" ? "light" : "dark"} backgroundColor={colorScheme === "dark" ? "#121212" : "#f5f5f5"} />
            <View style={{width: "100%"}}>
                <Image
                    source={{uri: 'https://wallpapers.com/images/hd/aesthetic-profile-picture-desert-landscape-4xdwnstzqycnfzjr.jpg'}}
                    resizeMode="cover"
                    style={{
                        height: 228,
                        width: "100%"
                    }}
                />
            </View>

            <View style={{flex: 1, alignItems: "center", backgroundColor: "white"}}>
                <Image 
                    source={{uri: 'https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D'}}
                    resizeMode="contain"
                    style={{
                        height: 155,
                        width: 155,
                        borderRadius: 999,
                        borderColor: '#3DB6EF',
                        borderWidth: 2,
                        marginTop: -90
                    }}
                />
                <Text style={{
                    fontFamily: 'outfit-medium',
                    fontSize: 20,
                    marginVertical: 8,
                    color: '#3DB6EF'
                }}>Melissa Peters</Text>
                <Text style={{color: 'black'}}>Interior Design</Text>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 6,
                }}>
                    <MaterialIcons name="location-on" size={34} color="black"/>
                    <Text style={{
                        fontFamily: 'outfit-medium', 
                        fontSize: 20, 
                        marginLeft: 4
                        }}>Vanice, Italy</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}
