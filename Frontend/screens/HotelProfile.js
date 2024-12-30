import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Image,
  Dimensions,
  FlatList,
  Button,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import { rsdata } from "../data/reservationsData";
import Entypo from "@expo/vector-icons/Entypo";
import * as Progress from "react-native-progress";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Reviews from "../components/Reviews";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 300;


const HotelProfile = () => {

  //Navigation

  const navigation = useNavigation();

  // Scroll Animation
  const scrollRef = useAnimatedRef();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const ImageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.4]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  // Rating states
  const [rate, setRate] = useState(8.4);
  const [room, setRoom] = useState();
  const [service, setService] = useState();
  const [price, setPrice] = useState();
  const [star, setStar] = useState([1, 2, 3, 4]);

  return (
    <View style={styles.container}>
      <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
        <Animated.Image
          source={require("../assets/images/hotel1 2.jpg")}
          style={[styles.image, ImageAnimatedStyle]}
        />
        <LinearGradient
          style={{ flex: 1 }}
          colors={["transparent", "rgba(0,0,0,0.9)"]}
        ></LinearGradient>

        {/* Detaills Section */}

        <View style={{ backgroundColor: "#fff", width, height: 1350, flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 10
            }}
          >
            <Text style={styles.text}>Grand Royale Hotel Park</Text>
            <View>
              <Text style={styles.price}>$230</Text>
              <Text style={{ marginTop: 10, fontSize: 20 }}>per night</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Entypo
              name="location"
              size={24}
              color="#1995AD"
              style={{ marginLeft: 20 }}
            />
            <Text style={styles.subtext}>{rsdata[0].adresse}</Text>
          </View>
          <View
            style={{
              width: "90%",
              borderColor: "black",
              borderWidth: 0.5,
              marginTop: 20,
              marginLeft: 20,
            }}
          ></View>

          {/* Summary Section */}

          <View>
            <Text style={[styles.summary, { color: "gray" }]}>Summary</Text>
            <Text style={styles.summary}>
              Kigali, city and capital of Rwanda. It is located in the centre of
              the country on the Ruganwa River. Butare also known as Huye and
              formerly known as Astrida, is a city with a population of 62,823
            </Text>
          </View>
          <View
            style={{
              width: "90%",
              borderColor: "black",
              borderWidth: 0.5,
              marginTop: 30,
              marginLeft: 20,
            }}
          ></View>

          {/* Rating section */}

          <View
            style={{
              marginTop: 30,
              marginLeft: 20,
              shadowColor: "#000",
              shadowOffset: { width: 5, height: 5 },
              shadowOpacity: 0.4,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.rate}>{rate}</Text>
              <View>
                <Text
                  style={{
                    marginLeft: 20,
                    marginTop: 10,
                    fontWeight: 500,
                    fontSize: 20,
                  }}
                >
                  Overrall Rating
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    marginLeft: 20,
                    marginTop: 10,
                  }}
                >
                  {star.map((item) => {
                    return (
                      <FontAwesome name="star" size={24} color="#007A8C" />
                    );
                  })}
                </View>
              </View>
            </View>
            <View
              style={{
                marginTop: 20,
                alignItems: "center",
                flexDirection: "row",
                marginLeft: 10,
              }}
            >
              <Text style={{ marginRight: 15, fontWeight: 500, fontSize: 15 }}>
                Room
              </Text>
              <Progress.Bar progress={34} width={250} color="#007A8C" />
            </View>
            <View
              style={{
                marginTop: 20,
                alignItems: "center",
                flexDirection: "row",
                marginLeft: 10,
              }}
            >
              <Text style={{ marginRight: 15, fontWeight: 500, fontSize: 15 }}>
                Service
              </Text>
              <Progress.Bar progress={34} width={250} color="#007A8C" />
            </View>
            <View
              style={{
                marginTop: 20,
                alignItems: "center",
                flexDirection: "row",
                marginLeft: 10,
              }}
            >
              <Text style={{ marginRight: 20, fontWeight: 500, fontSize: 15 }}>
                Price
              </Text>
              <Progress.Bar progress={34} width={250} color="#007A8C" />
            </View>
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

          {/* Photos Sections */}

          <View style={{ marginTop: 30, marginLeft: 20 }}>
            <View
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Text style={{ fontSize: 20, marginBottom: 20 }}>Photos</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Gallery")}>
              <Text
                style={{
                  fontSize: 15,
                  marginBottom: 20,
                  marginRight: 20,
                  color: "#1995AD",
                }}
              >
                See all
              </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={rsdata}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <Image
                  source={item.img}
                  style={{
                    width: 200,
                    height: 200,
                    marginRight: 10,
                    borderRadius: 20,
                  }}
                />
              )}
            />
          </View>

          {/* Reviews Sections */}

          <View style={{ marginTop: 30, marginLeft: 20 }}>
            <View style={{flexDirection:"row", justifyContent: "space-between"}}>
            <Text style={{ fontSize: 20, marginBottom: 20 }}>Reviews</Text>
            <Text onPress={() =>{navigation.navigate('Reviews')}} style={{ fontSize: 15, marginBottom: 20, marginRight: 20, color: "#1995AD" }}>See all</Text>
            </View>
            <Reviews />
          </View>

          {/* Booking Button */}
          <Pressable
            onPress={() => {
              navigation.navigate('Booking');
            }}
          >
            <View style={styles.book}>
              <Button
                title="Book Now"
                color="white"
                onPress={() => {
                  navigation.navigate('Booking');
                }}
              />
            </View>
          </Pressable>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default HotelProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    width,
    height: 600,
  },
  text: {
    fontWeight: "bold",
    fontSize: 30,
    marginLeft: 20,
    marginTop: 10,
    width: 200,
  },
  subtext: {
    marginLeft: 20,
    marginTop: 10,
  },
  price: {
    fontWeight: "bold",
    fontSize: 30,
    marginTop: 10,
    marginRight: 20,
  },
  summary: {
    fontWeight: 400,
    fontSize: 15,
    marginTop: 20,
    marginRight: 20,
    marginLeft: 20,
  },
  rate: {
    fontSize: 60,
    color: "#1995AD",
  },
  book: {
    backgroundColor: "#1995AD",
    width: "90%",
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    marginTop: 50,
    marginLeft: 20,
  },
});