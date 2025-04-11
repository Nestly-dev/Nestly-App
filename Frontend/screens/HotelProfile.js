import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  FlatList,
  Button,
  Pressable,
  TouchableOpacity,
  Modal
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
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
import axios from "axios";
import AuthContext from "../context/AuthContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import RoomComponent from "../components/RoomComponent";
import MapLocation from "../components/MapLocation";
import Loading from "./LoadingScreen";
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 300;

const HotelProfile = () => {
  const [isloading, setIsLoading] = useState(true);
  const { currentID, currentRoomId } = useContext(AuthContext);
  const [hotelName, setHotelName] = useState();
  const [adresse, setAdresse] = useState();
  const [summary, setSummary] = useState("");
  const [rate, setRate] = useState(0);
  const [room, setRoom] = useState();
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });
  const [bg, setBg] = useState();
  const [media, setMedia] = useState();
  const [roomInfo, setRoomInfo] = useState();
  const [basePrice, setBaseprice] = useState();
  const [menu, setMenu] = useState()

  //API Calls
  useEffect(() => {
    const url = `http://127.0.0.1:8000/api/v1/hotels/profile/${currentID}`;

    axios
      .get(url)
      .then((response) => {
        const result = response.data;
        const hotelDetails = result.data;
        setHotelName(hotelDetails.name);
        setAdresse(hotelDetails.street_address);
        setSummary(hotelDetails.long_description);
        setRate(hotelDetails.star_rating);
        setRoom(hotelDetails.total_rooms);
        setMedia(hotelDetails.media);
        setRoomInfo(hotelDetails.rooms);
        // setBaseprice(hotelDetails.rooms[0].basePrice);

        // Convert coordinates to numbers
        const lat = Number(hotelDetails.latitude);
        const lng = Number(hotelDetails.longitude);

        // Set individual state values if you need them elsewhere
        setLatitude(lat);
        setLongitude(lng);

        // Set location state using the values directly from the API
        setLocation({
          latitude: lat,
          longitude: lng,
          longitudeDelta: 0.02,
          latitudeDelta: 0.02,
        });

        setBg(hotelDetails.media[0].url);
        setBaseprice(hotelDetails.rooms[0].roomFee);
        setMenu(hotelDetails.menu_download_url)
        setIsLoading(false)
      })
      .catch((error) => {
        console.log("We are facinig an error", error);
      });
  }, []);

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
  const [service, setService] = useState();
  const [price, setPrice] = useState();
  const [star, setStar] = useState([1, 2, 3, 4]);

  return (
    <View style={styles.container}>
      <Modal visible={isloading} animationType="slide">
        <Loading/>
      </Modal>
      <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
        <Animated.Image
          source={{ uri: `${bg}` }}
          style={[styles.image, ImageAnimatedStyle]}
        />
        <LinearGradient
          style={{ flex: 1 }}
          colors={["transparent", "rgba(0,0,0,0.9)"]}
        ></LinearGradient>

        {/* Detaills Section */}

        <View style={{ backgroundColor: "#fff", width, flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Text style={styles.text}>{hotelName}</Text>
            <View>
              <Text style={styles.price}>${basePrice}</Text>
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
            <Text style={styles.subtext}>{adresse}</Text>
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
            <Text style={styles.summary}>{summary}</Text>
            <View style={{marginLeft: 20, marginTop: 20}}>
            <Text style={{fontSize: 17, fontWeight: 500, color:"#1995AD"}}>Email: <Text style={{fontSize: 17, color:"black"}}> ialainquentin@gmail.com </Text></Text>
            <Text style={{fontSize: 17, fontWeight: 500, color:"#1995AD", marginTop: 10}}>Telephone: <Text style={{fontSize: 17, color:"black"}}>+250783520488</Text></Text>
            </View>
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
              <Text style={{ fontSize: 20, marginBottom: 20, fontWeight: 500 }}>
                Photos
              </Text>
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
              data={media}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: `${item.url}` }}
                  style={{
                    width: 200,
                    height: 200,
                    marginRight: 10,
                    borderRadius: 10,
                  }}
                />
              )}
            />
          </View>

          {/* Available Rooms */}
          <View>
            <Text
              style={{
                fontSize: 20,
                marginBottom: 20,
                marginTop: 20,
                marginLeft: 20,
                fontWeight: 500,
              }}
            >
              Room Available ({room})
              <MaterialCommunityIcons
                name="sticker-check"
                size={24}
                color="#4cbf04"
              />
            </Text>
            <RoomComponent roomInfo={roomInfo} />
          </View>

          {/* The map and direction */}

          <Text
            style={{
              fontSize: 20,
              marginBottom: 20,
              marginTop: 20,
              marginLeft: 20,
              fontWeight: 500,
            }}
          >
            Maps Location
          </Text>
          <MapLocation location={location} name={hotelName} />

          {/* Reviews Sections */}

          <View style={{ marginTop: 30, marginLeft: 20 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: 20, marginBottom: 20, fontWeight: 500 }}>
                Reviews
              </Text>
              <Text
                onPress={() => {
                  navigation.navigate("Reviews");
                }}
                style={{
                  fontSize: 15,
                  marginBottom: 20,
                  marginRight: 20,
                  color: "#1995AD",
                }}
              >
                See all
              </Text>
            </View>
            <Reviews />
          </View>

          {/* The menu */}

          <View>
            <Text
              style={{
                fontSize: 20,
                marginBottom: 20,
                marginTop: 20,
                marginLeft: 20,
                fontWeight: 500,
              }}
            >
              Hotel Menu
            </Text>
            <View style={styles.Menucontainer}>
              <WebView
                source={{ uri: `${menu}` }}
                style={styles.webview}
              />
            </View>
          </View>

          {/* Booking Button */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Booking");
            }}
          >
            <View style={styles.book}>
              <Button
                title="Book Now"
                color="white"
                onPress={() => {
                  navigation.navigate("Booking");
                }}
              />
            </View>
          </TouchableOpacity>
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
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 30,
    marginLeft: 20,
  },
  Menucontainer: {
    flex: 1,
    width: "100%",
    height: 500,
  },
  webview: {
    flex: 1,
    
  },
});
