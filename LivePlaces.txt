import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Pressable
} from "react-native";
import React from "react";
import { livedata } from "../data/data";
import { useNavigation } from "@react-navigation/native";

const LivePlaces = () => {

  const navigation = useNavigation()
  return (
    <View>
      <Text
        style={{ fontSize: 23, fontWeight: 500, marginLeft: 20, marginTop: 30 }}
      >
        Top Destinations
      </Text>
      <FlatList
      
        horizontal={true}
        autoplay={true}
        style={{ paddingVertical: 5 }}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 50, paddingHorizontal: 12 }}
        data={livedata}
        keyExtractor={(item, idx) => item + idx}
        renderItem={({ item }) => (
          <Pressable >
          <TouchableOpacity onPress={() => navigation.navigate('Top Places Gallery')}>
            <View style={{ height: 300, borderRadius: 20, marginTop: 20 }}>
              <Image
                source={item.img}
                style={{
                  width: "100%",
                  height: 300,
                  borderRadius: 10,
                  position: "absolute",
                }}
                
              />
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 30,
                  top: 240,
                  left: 20,
                  width: 300
                }}
              >
                {item.name}
              </Text>

              
            </View>
          </TouchableOpacity>
          </Pressable>
        )}
      />
    </View>
  );
};

export default LivePlaces;

const styles = StyleSheet.create({});
