import { Tabs } from 'expo-router';
import React from 'react';
import {View} from 'react-native'
import { Ionicons, FontAwesome5, FontAwesome6  } from '@expo/vector-icons'
import { Platform } from 'react-native';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: '#3DB6EF',
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
          elevation: 0,
          height: 60,
          backgroundColor: 'white'
        }
      }}>
      <Tabs.Screen name='homepage'
          options={{
            tabBarIcon: ({color})=> <Ionicons name="home-sharp" size={30} color={color} />
          }}
        />
      <Tabs.Screen name='betHistory'
          options={{
            tabBarIcon: ({color})=> <FontAwesome5   name="money-check" size={30} color={color} />
          }}
        />
      <Tabs.Screen name='roullete'
          options={{
            tabBarIcon: ({color})=> {
              return (
                <View 
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#000000",
                    height: Platform.OS == "ios" ? 50 : 60,
                    width: Platform.OS == "ios" ? 50 : 60,
                    top: Platform.OS == "ios" ? -10: -20,
                    borderRadius: Platform.OS == "ios" ? 25 : 30,
                    borderWidth: 2,
                    borderColor: '#3DB6EF'
                  }}
                >
                  {/* <FontAwesome5 name="award" size={30} color={color} /> */}
                  <FontAwesome5 name="dice-d6" size={30} color={color} />
                </View>
              )
            }
          }}
        />
      <Tabs.Screen name='settings'
          options={{
            tabBarIcon: ({color})=> <Ionicons    name="settings" size={30} color={color} />
          }}
        />
      <Tabs.Screen name='profile'
          options={{
            tabBarIcon: ({color})=> <FontAwesome5   name="user" size={30} color={color} />
          }}
        />
    </Tabs>
  );
}
