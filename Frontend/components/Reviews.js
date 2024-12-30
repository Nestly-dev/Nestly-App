import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { data } from "../data/reviewdata";

const Reviews = () => {
  return (
    <>
      <View
        style={{
          marginBottom: 30,
          borderColor: "gray",
          borderWidth: 0.5,
          padding: 4,
          borderRadius: 20,
          marginRight: 10,
          backgroundColor: "#ededed",
          shadowColor: "#000",
          shadowOffset: {width: 0, height: 3},
          shadowOpacity: 1
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Image source={{ uri: data[0].profile }} style={styles.rate} />
          <View>
            <Text
              style={{
                marginLeft: 20,
                marginTop: 10,
                fontWeight: 500,
                fontSize: 20,
              }}
            >
              {data[0].name}
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginLeft: 20,
                marginTop: 10,
              }}
            >
              <Text>{data[0].date}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.review}>{data[0].review}</Text>
      </View>

      {/* Second person */}

      <View
        style={{
          borderColor: "gray",
          borderWidth: 0.5,
          padding: 4,
          borderRadius: 20,
          marginRight: 10,
          backgroundColor: "#ededed",
          shadowColor: "#000",
          shadowOffset: {width: 0, height: 3},
          shadowOpacity: 1
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Image source={{ uri: data[1].profile }} style={styles.rate} />
          <View>
            <Text
              style={{
                marginLeft: 20,
                marginTop: 10,
                fontWeight: 500,
                fontSize: 20,
              }}
            >
              {data[1].name}
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginLeft: 20,
                marginTop: 10,
              }}
            >
              <Text>{data[1].date}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.review}>{data[1].review}</Text>
      </View>
    </>
  );
};

export default Reviews;

const styles = StyleSheet.create({
  rate: {
    width: 70,
    height: 70,
    borderRadius: 100,
  },
  review: {
    marginTop: 20,
    marginLeft: 10,
    fontSize: 16,
    width: "95%",
  },
});
