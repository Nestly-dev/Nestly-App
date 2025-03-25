import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Modal,
  TouchableOpacity,
  ScrollView,
  Button,
  FlatList,
  TextInput
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import "react-native-gesture-handler";
import Payment from "../components/Payment";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import RoomDetailComponent from "../components/RoomDetailComponent";
import RoomItem from "../components/RoomItem";
import {BASEURL} from "@env"

const BookingScreen = () => {
  const [name, setName] = useState();
  const [province, setProvince] = useState();
  const [country, setCountry] = useState();
  const [bg, setBg] = useState();
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [room, setRoom] = useState("Default");
  const [singles, setSingles] = useState(0);
  const [doubles, setDoubles] = useState(0);
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date());
  const { showConfirmation, setShowConfirmation, currentID } =
    useContext(AuthContext);
  const [roomInfo, setRoomInfo] = useState();
  const [roomPrices, setRoomPrices] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [serviceFee] = useState(10);

  const onChangeCheckIn = (e, selectedDate) => {
    setCheckInDate(selectedDate);
    console.log(checkInDate);
  };
  
  const onChangeCheckOut = (e, selectedDate) => {
    setCheckOutDate(selectedDate);
    console.log(checkOutDate);
  };
  
  const onConfirm = () => {
    console.log(adults);
    console.log(children);
    console.log(room);
    console.log(checkInDate.toLocaleDateString());
    console.log(checkOutDate.toLocaleDateString());
    console.log(`you have booked (${singles}) Single rooms`);
    console.log(`you have booked (${doubles}) Double rooms`);
    setShowConfirmation(true);
  };

  // Function to update individual room prices and recalculate total
  const updateRoomPrice = (roomType, price) => {
    setRoomPrices(prevPrices => {
      const newPrices = { ...prevPrices, [roomType]: price };
      
      // Calculate new total price from all room prices
      const newTotal = Object.values(newPrices).reduce((sum, price) => sum + price, 0);
      setTotalPrice(newTotal);
      
      return newPrices;
    });
  };

  useEffect(() => {
    const url = `http://127.0.0.1:8000/api/v1/hotels/profile/${currentID}`;
    axios
      .get(url)
      .then((response) => {
        const result = response.data;
        const hotelInfo = result.data;
        setName(hotelInfo.name);
        setProvince(hotelInfo.province);
        setCountry(hotelInfo.country);
        setBg(hotelInfo.media[1].url);
        setRoomInfo(hotelInfo.rooms);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Calculate the grand total including service fee
  const grandTotal = totalPrice + serviceFee;

  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          {/* Hotels Name Box */}

          <View
            style={{
              width: "100%",
              borderRadius: 10,
              marginBottom: 25,
              height: 240,
            }}
          >
            <View
              style={{ width: "100%", height: "100%", position: "absolute" }}
            >
              <Image
                source={{ uri: `${bg}` }}
                style={{ width: "100%", height: 250 }}
              />
            </View>
            <LinearGradient
              colors={["rgba(0, 0, 0, 0.5)", "rgba(0,0,0, 0.4)"]}
              style={{
                width: "100%",
                height: 80,
                top: 170,
                position: "absolute",
              }}
            ></LinearGradient>
            <Text
              style={{
                fontSize: 25,
                top: 170,
                color: "white",
                marginLeft: 20,
                fontWeight: "bold",
              }}
            >
              {name}
            </Text>
            <Text
              style={{
                fontSize: 20,
                top: 180,
                color: "white",
                marginLeft: 20,
                fontWeight: "bold",
              }}
            >
              {province}, {country}
            </Text>
          </View>

          <View
            style={{
              width: "90%",
              borderColor: "black",
              borderWidth: 0.3,
              marginTop: 30,
              marginLeft: 20,
            }}
          ></View>

          {/* Inputs */}

          {/* Check In / Check out Date */}

          <Text
            style={{
              color: "black",
              fontSize: 23,
              marginTop: 30,
              marginLeft: 15,
              fontFamily: "Inter",
              fontWeight: "500",
            }}
          >
            Schedule Time
          </Text>
          <View
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              marginLeft: 20,
              marginTop: 30,
              marginRight: 20,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 500 }}>Check In</Text>
            <DateTimePicker
              value={checkInDate}
              date="date"
              is24Hour={true}
              onChange={onChangeCheckIn}
            />
          </View>
          <View
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              marginLeft: 20,
              marginTop: 30,
              marginRight: 20,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 500 }}>Check Out</Text>
            <DateTimePicker
              value={checkOutDate}
              date="date"
              is24Hour={true}
              onChange={onChangeCheckOut}
            />
          </View>

          <View
            style={{
              width: "90%",
              borderColor: "black",
              borderWidth: 0.3,
              marginTop: 30,
              marginLeft: 20,
            }}
          ></View>

          {/* Room Details */}
          <View>
            <Text
              style={{
                color: "black",
                fontSize: 23,
                marginTop: 30,
                marginLeft: 15,
                fontFamily: "Inter",
                fontWeight: "500",
              }}
            >
              Room Detail
            </Text>
            {roomInfo && (
              <FlatList 
                data={roomInfo}
                keyExtractor={(item) => item.roomType}
                renderItem={({item}) => (
                  <RoomItem 
                    item={item} 
                    updateRoomPrice={updateRoomPrice} 
                  />
                )}
              />
            )}
           </View>
        

          {/* Guest Details */}

          <Text
            style={{
              color: "black",
              fontSize: 23,
              marginTop: 30,
              marginLeft: 15,
              fontFamily: "Inter",
              fontWeight: "500",
            }}
          >
            Guest List
          </Text>
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
            <Text style={{ fontSize: 18, fontWeight: 500 }}>Adults</Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{ backgroundColor: "#1995AD", borderRadius: 5 }}
                onPress={() => {
                  setAdults(adults + 1);
                }}
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
                {adults}
              </Text>
              <TouchableOpacity
                style={{ backgroundColor: "#1995AD", borderRadius: 5 }}
                onPress={() => {
                  if (adults > 0) {
                    setAdults(adults - 1);
                  } else {
                    return adults;
                  }
                }}
              >
                <Entypo name="minus" size={24} color="white" />
              </TouchableOpacity>
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
            <Text style={{ fontSize: 18, fontWeight: 500 }}>Children</Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{ backgroundColor: "#1995AD", borderRadius: 5 }}
                onPress={() => {
                  setChildren(children + 1);
                }}
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
                {children}
              </Text>
              <TouchableOpacity
                style={{ backgroundColor: "#1995AD", borderRadius: 5 }}
                onPress={() => {
                  if (children > 0) {
                    setChildren(children - 1);
                  } else {
                    return adults;
                  }
                }}
              >
                <Entypo name="minus" size={24} color="white" />
              </TouchableOpacity>
              
            </View>
          </View>

          {/* price details */}

          <Text
            style={{
              color: "black",
              fontSize: 23,
              marginTop: 30,
              marginLeft: 15,
              fontFamily: "Inter",
              fontWeight: "500",
            }}
          >
            Prices Details
          </Text>
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
          <Text style={{ fontSize: 18, fontWeight: 500 }}>Room Fee</Text>
          <Text style={{ fontSize: 18, color: "gray" }}>${totalPrice}</Text>
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
          <Text style={{ fontSize: 18, fontWeight: 500 }}>Service Fee</Text>
          <Text style={{ fontSize: 18, color: "gray" }}>${serviceFee}</Text>
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
          <Text style={{ fontSize: 20, fontWeight: 500 }}>Total Price</Text>
          <Text style={{ fontSize: 18, color: "gray" }}>${grandTotal}</Text>
        </View>
        <View
          style={{
            backgroundColor: "#1995AD",
            marginLeft: 20,
            marginRight: 20,
            marginTop: 30,
            height: 60,
            padding: 10,
            borderRadius: 50,
            marginBottom: 20,
          }}
        >
          <Button title="Confirm" color="white" onPress={onConfirm} />
        </View>

        <Modal visible={showConfirmation} animationType="slide">
          return <Payment grandTotal={grandTotal}/>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingScreen;

const styles = StyleSheet.create({});