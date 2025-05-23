import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import axios from "axios"
import AuthContext from '../context/AuthContext';

const RoomComponent = ({roomInfo}) => {

  const {currentID, currentRoomId, setCurrentRoomId, ip} = useContext(AuthContext)
  const [room, setRoom] = useState()

  
useEffect(() =>{
  // Getting The Room

  const url = `http://${ip}:8000/api/v1/hotels/rooms/${currentID}`
  axios.get(url)
  .then((response) =>{
    const results = response.data
    const roomDetail = results.data
    setRoom(roomDetail)
    
  })
  .catch((error) =>{
    console.log("This is the error ",error);
  })

}, [])

  return (
    <FlatList 
    data={roomInfo}
    renderItem={({item}) =>{
    return <View key={item.id}>
              <View
                style={{
                  marginLeft: 20,
                  flexDirection: "row",
                  borderColor: "rgb(233, 233, 233)",
                  borderWidth: 2,
                  marginRight: 10,
                  marginTop: 10,
                  width: "90%"
                }}
              >
                <Image
                  source={require("../assets/images/singel.jpeg")}
                  style={{ width: 120, height: 100, borderRadius: 10 }}
                />
                <View style={{ justifyContent: "center" }}>
                  <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                  <Text
                    style={{ fontSize: 18, fontWeight: 500, marginLeft: 20 }}
                  >
                    {item.roomType}
                  </Text>
                  <Text
                    style={{ fontSize: 18, fontWeight: 500, right: "-10%", fontWeight:"bold" }}
                  >
                    ${item.roomFee}
                  </Text>

                  </View>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      marginLeft: 20,
                      marginTop: 10,
                      width: "25%",
                      textAlign:"justify"
                    }}
                  >
                    {item.description}
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: 500,
                      marginLeft: 20,
                      marginTop: 10,
                      width: "100%",
                      textAlign:"justify"
                    }}
                  >
                    Max Occupancy: <Text style={{fontWeight: "bold"}}>{item.maxOccupancy} People</Text>
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
                <Text style={{ fontSize: 18, fontWeight: 500, color: "#4cbf04" }}>
                Available
                </Text>
                <View style={{flexDirection: "row"}}>
                  <Text style={{ fontSize: 18, fontWeight: 500, marginRight: 10 }}>20 Rooms</Text>
                  <View>
                  <MaterialCommunityIcons name="sticker-check" size={24} color="#4cbf04" />
                  </View>
                </View>
              </View>
    </View>
    }}
    />
    
  )
}

export default RoomComponent