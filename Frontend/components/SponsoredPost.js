import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from '@expo/vector-icons/AntDesign';

const SponsoredPost = () => {
  return (
    <>
    {/* First Sponsorship */}

      <View
        style={{
          width: "100%",
          padding: 2,
          borderRadius: 10,
          shadowColor: "#000",
          shadowOffset: { width: 3, height: 5 },
          shadowOpacity: 0.7,
          shadowRadius: 6,
          marginTop: 20,
          marginBottom: 25,
        }}
      >
        <Image
          source={require("../assets/images/hotel3.jpg")}
          style={{
            width: "95%",
            height: 250,
            marginLeft: 10,
            marginRight: 20,
            borderRadius: 5,
            marginTop: 5,
            marginBottom: 5,
          }}
        />
        <View
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            height: 50,
            position: "absolute",
            left: 20,
            top: 20,
            flexDirection: "row",
            borderRadius: 200,
          }}
        >
          <Image
            source={require("../assets/images/me.jpg")}
            style={{ width: 50, height: 50, borderRadius: 100 }}
          />
          <Text
            style={{
              marginTop: 15,
              marginLeft: 10,
              fontSize: 15,
              fontWeight: 600,
              color: "#fff",
              marginRight: 30,
            }}
          >
            Grand Palace Hotel
          </Text>
        </View>
        <View
          style={{
            backgroundColor: "#1995AD",
            width: 80,
            height: 40,
            position: "absolute",
            bottom: -15,
            left: 30,
            borderRadius: 50,
            padding: 5,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
         <AntDesign name="hearto" size={24} color="white" />
        </View>
        <View
          style={{
            backgroundColor: "#1995AD",
            width: 50,
            height: 40,
            position: "absolute",
            bottom: -15,
            right: 30,
            borderRadius: 50,
            padding: 5,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name="bookmark" size={23} color="white" />
        </View>
      </View>

       {/* Second Sponsorship*/}   

      <View
        style={{
          width: "100%",
          padding: 2,
          borderRadius: 20,
          shadowColor: "#000",
          shadowOffset: { width: 3, height: 5 },
          shadowOpacity: 0.7,
          shadowRadius: 6,
          marginTop: 10,
          marginBottom: 25,
        }}
      >
        <Image
          source={require("../assets/images/hotel11.avif")}
          style={{
            width: "95%",
            height: 250,
            marginLeft: 10,
            marginRight: 20,
            borderRadius: 5,
            marginTop: 5,
            marginBottom: 5,
          }}
        />
        <View
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            height: 50,
            position: "absolute",
            left: 20,
            top: 20,
            flexDirection: "row",
            borderRadius: 200,
          }}
        >
          <Image
            source={require("../assets/images/profile.webp")}
            style={{ width: 50, height: 50, borderRadius: 100 }}
          />
          <Text
            style={{
              marginTop: 15,
              marginLeft: 10,
              fontSize: 15,
              fontWeight: 600,
              color: "#fff",
              marginRight: 30,
            }}
          >
            Grand Palace Hotel
          </Text>
        </View>
        <View
          style={{
            backgroundColor: "#1995AD",
            width: 80,
            height: 40,
            position: "absolute",
            bottom: -15,
            left: 30,
            borderRadius: 50,
            padding: 5,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AntDesign name="hearto" size={24} color="white" />
        </View>
        <View
          style={{
            backgroundColor: "#1995AD",
            width: 50,
            height: 40,
            position: "absolute",
            bottom: -15,
            right: 30,
            borderRadius: 50,
            padding: 5,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name="bookmark" size={23} color="white" />
        </View>
      </View>
    </>
  );
};

export default SponsoredPost;

const styles = StyleSheet.create({});
