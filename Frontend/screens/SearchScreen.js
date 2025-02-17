import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TextInput,
  Modal,
  TouchableOpacity
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import Octicons from '@expo/vector-icons/Octicons';
import { Feather } from "@expo/vector-icons";
import AuthContext from "../context/AuthContext";
import WelcomeScreen from "./WelcomeScreen";
import { useNavigation } from "@react-navigation/native";



const SearchScreen = () => {

const [raw, setRaw]= useState([1,2,3,4,5])
const {signedIn, hotelData, setCurrentID} = useContext(AuthContext)
const navigation = useNavigation()
const {hotelID, setHotelID} = useState()

useEffect(() =>{
  //console.log(hotelData);
}, [])

if(!signedIn){
  return (
    <Modal visible={true} animationType="slide">
      <WelcomeScreen />
    </Modal>
  );
} else{
  return (
    <View style={{backgroundColor: "rgb(247, 247, 247)"}}>
        <ScrollView>
        <View style={{
          width: "100%",
          borderRadius: 10,
          marginBottom: 25,
          height: 240,
        }}>
          <View style={{ width: "100%", height: "100%",position:"absolute"}}>
            <Image
              source={require("../assets/images/banner.webp")}
              style={{ width: "100%", height: 250 }}
            />
          </View>
          <View style={styles.search}>
              <Feather
                name="search"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
              />
              <TextInput
                placeholder="Where do you want go?"
                style={{
                  fontSize: 20,
                  marginLeft: 10,
                  padding: 10,
                  width: "80%",
                }}
              />
              <Octicons name="sort-desc" size={24} color="black" />
            </View>
        </View>
    <SafeAreaView>
      
        <Text style={{
              color: "black",
              fontSize: 23,
              marginTop: 40,
              marginLeft: 15,
              fontFamily: "Inter",
              fontWeight: "500",
            }}>Suggested Places</Text>

            {/* places */}

            {hotelData.map((item) =>{
                return (
                <TouchableOpacity key={item.id}
                onPress={() =>{
                  navigation.navigate("Hotel Profile")
                  setCurrentID(item.id)
                }}
                >
                <View style={{marginLeft: 20, marginTop: 20, flexDirection: "row"}} >
                <Image source={require("../assets/images/hotel4.avif")} style={{width: 120, height: 100, borderRadius: 10}}/>
                <View style={{justifyContent:"center"}}>
                    <Text style={{fontSize: 18, fontWeight: 500, marginLeft: 20}}>{item.name}</Text>
                    <Text style={{fontSize: 15, fontWeight: 500, marginLeft: 20, marginTop: 10}}>{item.street_address}</Text>
                </View>
                </View>
                </TouchableOpacity>
                )
            })}
      
    </SafeAreaView>
    </ScrollView>
    </View>
  );

}

 
};

export default SearchScreen;

const styles = StyleSheet.create({
    search: {
        marginTop: 20,
        marginLeft: 15,
        marginRight: 10,
        height: 50,
        borderWidth: 1,
        backgroundColor: "rgb(255, 255, 255)",
        borderRadius: 10,
        alignItems: "center",
        flexDirection: "row",
        borderColor:"rgb(233, 233, 233)",
        top: 200
      },
});
