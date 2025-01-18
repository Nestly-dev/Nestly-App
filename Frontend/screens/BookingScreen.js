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
} from "react-native";
import React, { useContext, useState } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import "react-native-gesture-handler";

import Payment from "../components/Payment";
import AuthContext from "../context/AuthContext";

const BookingScreen = () => {
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [room, setRoom] = useState("Default");
  const [singles, setSingles] = useState(0);
  const [doubles, setDoubles] = useState(0);
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date());
  const { showConfirmation, setShowConfirmation } = useContext(AuthContext);

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
                source={require("../assets/images/banner2.jpg")}
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
              Hotel Grand Place
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
              Kigali, Rwanda
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

            <TouchableOpacity
              onPress={() => {
                setRoom("Single Room");
                console.log(room);
              }}
            >
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
                  Number of Single Rooms
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    style={{ backgroundColor: "#1995AD", borderRadius: 5 }}
                    onPress={() => {
                      setSingles(singles + 1);
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
                    {singles}
                  </Text>
                  <TouchableOpacity
                    style={{ backgroundColor: "#1995AD", borderRadius: 5 }}
                    onPress={() => {
                      if (singles > 0) {
                        setSingles(singles - 1);
                      } else {
                        return adults;
                      }
                    }}
                  >
                    <Entypo name="minus" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setRoom("Double Room");
                console.log(room);
              }}
            >
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
                  source={require("../assets/images/double room.jpg")}
                  style={{ width: 120, height: 100, borderRadius: 10 }}
                />
                <View style={{ justifyContent: "center" }}>
                  <Text
                    style={{ fontSize: 18, fontWeight: 500, marginLeft: 20 }}
                  >
                    Double Room
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
                  Number of Double Rooms
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    style={{ backgroundColor: "#1995AD", borderRadius: 5 }}
                    onPress={() => {
                      setDoubles(doubles + 1);
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
                    {doubles}
                  </Text>
                  <TouchableOpacity
                    style={{ backgroundColor: "#1995AD", borderRadius: 5 }}
                    onPress={() => {
                      if (doubles > 0) {
                        setDoubles(doubles - 1);
                      } else {
                        return doubles;
                      }
                    }}
                  >
                    <Entypo name="minus" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
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
          <Text style={{ fontSize: 18, color: "gray" }}>$247</Text>
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
          <Text style={{ fontSize: 18, color: "gray" }}>$10</Text>
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
          <Text style={{ fontSize: 18, color: "gray" }}>$257</Text>
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
          return <Payment />
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingScreen;

const styles = StyleSheet.create({});
