import { StyleSheet, Text, View, Image, FlatList } from "react-native";
import React from "react";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { posts } from "../data/postes";

const SponsoredPost = () => {
  return (
    <>
      {/* First Sponsorship */}
     {posts.map(item => {
      return (
        <View
        key={item.id}
        style={{
          width: "98%",
          padding: 10,
          borderRadius: 10,
          marginTop: 20,
          marginBottom: 25,
          borderColor: "rgb(200, 200, 200)",
          backgroundColor: "rgb(255, 255, 255)",
          borderWidth: 1,
          marginLeft: 5,
          marginRight: 5,
        }}
      >
        <Image
          source={{uri:`${item.img}`}}
          style={{
            width: "100%",
            height: 250,
            marginRight: 20,
            borderRadius: 5,
            marginBottom: 5,
          }}
        />
        <View
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            height: 50,
            position: "absolute",
            left: 10,
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
            {item.title}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: "#1995AD",
            width: 80,
            height: 40,
            position: "absolute",
            top: 240,
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
            top: 240,
            right: 30,
            borderRadius: 50,
            padding: 5,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name="bookmark" size={23} color="white" />
        </View>
        <View style={{ marginTop: 30, marginLeft: 10 }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              numberOfLines={3}
              style={{ fontWeight: 400, fontSize: 15, fontStyle: "italic", textAlign:"justify" }}
            >
              {item.caption}
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 20 }}>
              <FontAwesome name="star" size={24} color="#1995AD" />
              <Text style={{ marginLeft: 10, marginTop: 3, fontSize: 17 }}>
                4.5 Rating
              </Text>
            </View>
          <View style={{flexDirection:"row", justifyContent:"space-between"}}>
          <View style={{marginTop: 20}}>
            <Text>Start from</Text>
            <Text style={{fontSize: 20, marginTop: 5, color:"#03045E", fontWeight: 500}}>$100/per night</Text>
          </View>
          
          <View style={{backgroundColor: "#1995AD", width: 100, height:40, marginTop: 25, borderRadius: 10}}>
          <Text style={{color:"white", fontWeight:"bold", fontSize: 15, padding: 10}}>See Details</Text>
          </View>

          </View>
        </View>
      </View>
      )
     })}
      
      
    </>
  );
};

export default SponsoredPost;

const styles = StyleSheet.create({});
