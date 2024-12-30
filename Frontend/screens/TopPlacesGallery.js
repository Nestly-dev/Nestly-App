import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  useWindowDimensions,
  TouchableOpacity,
  Button,
} from "react-native";
import React, { useRef, useState } from "react";
import { rcdata } from "../data/rcdata";
import { useNavigation } from "@react-navigation/native";

const Gallery = () => {
  const { width, height } = useWindowDimensions();
  const IMG_SIZE = 350;
  const SPACING = 10;
  const topRef = useRef();
  const bottomRef = useRef();
  const [activeIndex, setActiveIndex] = useState();
  const navigation = useNavigation()
  const scrollToActiveIndex = (index) => {
    setActiveIndex(index);
    topRef?.current?.scrollToOffset({
      offset: index * width,
      animated: true,
    });
    if (index * (IMG_SIZE + SPACING) - IMG_SIZE / 2 > width / 2) {
      bottomRef?.current?.scrollToOffset({
        offset: index * (IMG_SIZE + SPACING) - width / 2 + IMG_SIZE / 2,
        animated: true,
      });
    }
  };

  return (
    <View style={{ width, height }}>
      <FlatList
        data={rcdata}
        ref={topRef}
        onMomentumScrollEnd={(e) => {
          scrollToActiveIndex(
            Math.floor(e.nativeEvent.contentOffset.x / width)
          );
        }}
        pagingEnabled
        horizontal={true}
        renderItem={({ item }) => (
          <View>
            <Image source={item.img} style={{ width, height: "100%" }} />
          </View>
        )}
      />
      <FlatList
        ref={bottomRef}
        data={rcdata}
        pagingEnabled
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        style={{ position: "absolute", bottom: 140 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => {
              scrollToActiveIndex(index);
            }}
          >
            <View
              style={{
                height: 155,
                borderRadius: 20,
                marginRight: SPACING,
                borderWidth: 4,
                borderColor: activeIndex === index ? "#fff" : "transparent",
                justifyContent: "space-between",
                flexDirection: "row",
                backgroundColor: "rgba(250, 250 ,250, 0.5)",
                alignItems: "center",
              }}
            >
              <Image
                source={item.img}
                style={{
                  width: 150,
                  height: 150,
                  marginRight: SPACING,
                  borderRadius: 20,
                }}
              />
              <View>
                <Text
                  style={{
                    fontSize: 20,
                    marginLeft: 15,
                    marginRight: 20,
                    marginTop: 20,
                    fontWeight: "bold",
                  }}
                >
                  {item.name}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    marginLeft: 15,
                    marginRight: 20,
                    marginTop: 10,
                    fontWeight: 500,
                  }}
                >
                  Kigali.Rwanda
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    marginLeft: 15,
                    marginTop: 10,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#1995AD",
                      padding: 5,
                      borderRadius: 50,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "bold",
                        color: "white",
                      }}
                    >
                      $150
                    </Text>
                  </View>
                  <Text
                    style={{ marginLeft: 7, marginTop: 4, fontWeight: 700 }}
                  >
                    per night
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: "#1995AD",
                    marginTop: 10,
                    borderRadius: 30,
                    width: 100,
                    marginLeft: 30,
                    marginBottom: 15,
                  }}
                >
                  <Button title="Book" color="white" onPress={() => navigation.navigate("Hotel Profile")}/>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Gallery;