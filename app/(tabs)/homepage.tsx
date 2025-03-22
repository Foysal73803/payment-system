import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, Foundation  } from '@expo/vector-icons';
import TransactionItem from '@/components/TransactionItem';
import { useUser } from '@/context/userManage';
import { stompService } from '@/services/socket';
import { Transaction } from '@/types/types';

export default function homepage() {
    const router = useRouter();
    const { height } = Dimensions.get("window");
    const { user } = useUser();
    const [transactions, setTransactions] = useState<Transaction[]>(user?.transactions || []);

    useEffect(() => {
        // Subscribe to transaction updates via WebSocket
        
    }, [user]);
    
    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <LinearGradient
                    colors={['#3DB6EF', '#37CDF0', '#3DB6EF']}
                    start={{x: 1, y: 0}}
                    end={{x: 1, y: 1}}
                    style={{flex: 1}}
                >
                    <View style={{flex: 1, flexDirection: 'row', padding: 20, paddingTop: 50, justifyContent: 'space-between'}}>
                        <View style={{flexDirection: 'row', gap: 10}}>
                            <Image style={{width: 40, height: 50, borderRadius: 40}} source={require('@/assets/images/unnamed.webp')} />
                            <View>
                                <Text style={{color: 'white', fontSize: 15, fontFamily: 'outfit-medium',}}>Hello</Text>
                                <Text style={{color: 'white', fontSize: 20, fontFamily: 'outfit-medium',}}>{user?.userName}</Text>
                            </View>
                        </View>
                        <TouchableOpacity>
                            <Ionicons name="notifications-outline" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    <View style={{flex: 1, alignItems: 'center'}}>
                        <Text style={{color: 'white', fontSize: 18}}>Balance</Text>
                        <Text style={{
                            fontFamily: 'outfit-bold',
                            fontSize: 34, 
                            color: 'white'
                        }}>{user?.balance}.00 Taka</Text>
                    </View>
 
                    <View style={{flex: 2, flexDirection: 'row', justifyContent: 'space-evenly'}}>
                        <View style={{alignItems: 'center'}}>
                            <TouchableOpacity style={styles.touchButton} onPress={() => router.push('/add-credit')}>
                                <MaterialIcons name="add-card" size={34} color="white" />
                            </TouchableOpacity>
                            <Text style={{fontSize: 20, color: 'white', fontFamily: 'outfit-medium'}}>Buy</Text>
                        </View>   
                        <View style={{alignItems: 'center'}}>
                            <TouchableOpacity style={styles.touchButton} onPress={() => router.push('/cash-out-credit')}>
                                <Ionicons name="bag-remove-outline" size={34} color="white" />
                            </TouchableOpacity>
                            <Text style={{fontSize: 20, color: 'white', fontFamily: 'outfit-medium'}}>Sell</Text>
                        </View>
                        <View style={{alignItems: 'center'}}>
                            <TouchableOpacity style={styles.touchButton}>
                                <MaterialIcons name="payments" size={34} color="white" onPress={() => router.push('/transfer-credit')}/>
                            </TouchableOpacity>
                            <Text style={{fontSize: 20, color: 'white', fontFamily: 'outfit-medium'}}>Transfer</Text>
                        </View>
                        <View style={{alignItems: 'center'}}>
                            <TouchableOpacity style={styles.touchButton}>
                                <Foundation name="page-multiple" size={34} color="white" />
                            </TouchableOpacity>
                            <Text style={{fontSize: 20, color: 'white', fontFamily: 'outfit-medium'}}>More</Text>
                        </View>
                    </View>
                </LinearGradient>
            </View>
            <View style={[styles.textContainer, {height: height-500}]}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={styles.textStyle}>Latest Transaction</Text>
                    <TouchableOpacity onPress={() => router.push('/transactions')}>
                        <Text style={{color: '#3DB6EF', fontFamily: 'outfit-medium'}}>See all</Text>
                    </TouchableOpacity>
                </View> 
                <FlatList 
                    data={transactions.slice(0, 4)}
                    renderItem={TransactionItem}
                    keyExtractor={(item) => item.id!}
                    scrollEnabled
                />     
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    topContainer: {
        width: '100%',
        height: 450
    },
    textContainer: {
        backgroundColor:'#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 15,
        gap: 20,
        marginBottom: 20
    },
    textStyle: {
        fontSize: 24,
        fontFamily: 'outfit-bold',
        color: '#8554f7'
    },
    detailStyle: {
        fontFamily: 'outfit',
        fontSize: 17,
        textAlign: 'center',
        color: '#808080',
    },
    touchButton: {
        borderRadius: 17, 
        backgroundColor: '#94D3F6', 
        padding: 10
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontFamily: 'outfit',
        fontSize: 17
    }
})