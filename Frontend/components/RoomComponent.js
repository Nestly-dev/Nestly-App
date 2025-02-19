import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import axios from "axios"
import AuthContext from '../context/AuthContext';

const RoomComponent = () => {

  const {currentID} = useContext(AuthContext)
  const [room, setRoom] = useState()

  
useEffect(() =>{
  const url = `http://127.0.0.1:8000/api/v1/hotels/rooms/${currentID}`
  axios.get(url)
  .then((response) =>{
    const results = response.data
    const roomDetail = results.data
    console.log(roomDetail);
  })
  .catch((error) =>{
    console.log("This is the error ",error);
  })
}, [])
 
  return (
    <TouchableOpacity>
              <View
                style={{
                  marginLeft: 20,
                  flexDirection: "row",
                  borderColor: "rgb(233, 233, 233)",
                  borderWidth: 2,
                  marginRight: 10,
                  marginTop: 10
                }}
              >
                <Image
                  source={require("../assets/images/singel.jpeg")}
                  style={{ width: 120, height: 100, borderRadius: 10 }}
                />
                <View style={{ justifyContent: "center" }}>
                  <Text
                    style={{ fontSize: 18, fontWeight: 500, marginLeft: 20 }}
                  >
                    Signal Room
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: 500,
                      marginLeft: 20,
                      marginTop: 10,
                    }}
                  >
                    Served with Breakfast
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
                <Text style={{ fontSize: 18, fontWeight: 500 }}>
                Available
                </Text>
                <View style={{flexDirection: "row"}}>
                  <Text style={{ fontSize: 18, fontWeight: 500, marginRight: 10 }}>20 Rooms</Text>
                  <View>
                  <MaterialCommunityIcons name="sticker-check" size={24} color="#4cbf04" />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
  )
}

export default RoomComponent