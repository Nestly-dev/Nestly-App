import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const TrendingPlaces = ({item}) => {
  return (
    <View style={styles.container}>
      <Image
        source={item.img}
        style={styles.img}
      />
      <Text
        style={{ fontSize: 25, fontWeight: 500, marginTop: 10, marginLeft: 10 }}
      >
        {item.name}
      </Text>
      <Text marginLeft={10} marginTop={4}>
        Volcano In East
      </Text>
      <View marginLeft={10} marginTop={10} style={{ flexDirection: "row" }}>
        <MaterialIcons name="star-rate" size={24} color="#C5630C" />
        <Text marginTop={5} marginLeft={5}>
          4.6
        </Text>
      </View>

      <View style={styles.price}>
        <View>
          <Text>Start From</Text>
          <Text style={{ fontSize: 18, color: "#03045E", fontWeight: 500 }}>
            $150/Night
          </Text>
        </View>
        <View
          style={{
            backgroundColor: "#1995AD",
            borderRadius: 10,
            marginRight: 10,
          }}
        >
          <Text style={{ color: "white", padding: 10 }}>EDSF</Text>
        </View>
      </View>
    </View>
  );
};

export default TrendingPlaces;

const styles = StyleSheet.create({
  container: {
    width: 250,
    borderRadius: 10,
    backgroundColor: "rgb(255, 255, 255)",
    marginTop: 20,
    borderColor:"rgb(223, 223, 223)",
    borderWidth: 1
  },
  img: {
    width: "100%",
    height: 200,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 0.7,
    shadowRadius: 6,
  },
  price: {
    marginLeft: 10,
    marginBottom: 20,
    marginTop: 40,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
});
