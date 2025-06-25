import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import Entypo from "@expo/vector-icons/Entypo";

const RoomItem = ({ item, updateRoomPrice }) => {
    const [roomCount, setRoomCount] = useState(0);
    
    // Update the price in the parent component whenever roomCount changes
    useEffect(() => {
        const roomPrice = parseFloat((item.roomFee * roomCount).toFixed(2));
        updateRoomPrice(item.roomType, roomPrice);
    }, [roomCount, item.roomFee, item.roomType]); // Removed updateRoomPrice from dependencies

    // Memoize increment/decrement functions to prevent unnecessary re-renders
    const incrementRoom = useCallback(() => {
        setRoomCount(prev => prev + 1);
    }, []);

    const decrementRoom = useCallback(() => {
        setRoomCount(prev => prev > 0 ? prev - 1 : 0);
    }, []);

    return (
        <View>
            <View
                style={{
                    marginLeft: 20,
                    marginTop: 20,
                    flexDirection: "row",
                    borderColor: "rgb(233, 233, 233)",
                    borderWidth: 2,
                    marginRight: 10,
                }}
            >
                <Image
                    source={require("../assets/images/singel.jpeg")}
                    style={{ width: 120, height: 100, borderRadius: 10 }}
                />
                <View style={{ justifyContent: "center" }}>
                    <Text
                        style={{ fontSize: 18, fontWeight: "500", marginLeft: 20 }}
                    >
                        {item.roomType}
                    </Text>
                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: "500",
                            marginLeft: 20,
                            marginTop: 10,
                        }}
                    >
                        Served with Breakfast
                    </Text>
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: "bold", // Removed duplicate fontWeight
                            marginLeft: 20,
                            marginTop: 10,
                        }}
                    >
                        Price: ${parseFloat(item.roomFee).toFixed(2)}
                    </Text>
                </View>
            </View>
            <View
                style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    marginLeft: 20,
                    marginTop: 20,
                    marginRight: 20,
                }}
            >
                <Text style={{ fontSize: 18, fontWeight: "500" }}>
                    Number of {item.roomType}
                </Text>
                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                        style={{ backgroundColor: "#1995AD", borderRadius: 5 }}
                        onPress={incrementRoom}
                    >
                        <Entypo name="plus" size={24} color="white" />
                    </TouchableOpacity>
                    <Text
                        style={{
                            fontSize: 20,
                            color: "gray",
                            marginLeft: 10,
                            marginRight: 10,
                        }}
                    >
                        {roomCount}
                    </Text>
                    <TouchableOpacity
                        style={{ backgroundColor: "#1995AD", borderRadius: 5 }}
                        onPress={decrementRoom}
                    >
                        <Entypo name="minus" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
            <View
                style={{
                    marginLeft: 20,
                    marginTop: 10,
                    marginRight: 20,
                    alignItems: "flex-end",
                }}
            >
                <Text style={{ fontSize: 16, fontWeight: "bold", color: "#1995AD" }}>
                    Subtotal: ${(item.roomFee * roomCount).toFixed(2)}
                </Text>
            </View>
        </View>
    )
}

export default RoomItem