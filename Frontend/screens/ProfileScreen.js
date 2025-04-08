import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  Button,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useState } from "react"
import Ionicons from "@expo/vector-icons/Ionicons";
import { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from '@expo/vector-icons/Entypo';
import Octicons from '@expo/vector-icons/Octicons';
import WelcomeScreen from "./WelcomeScreen";
import {BASEURL} from "@env"

const ProfileScreen = () => {

  const { user, setSignedIn, signedIn, saveAuthStatus } = useContext(AuthContext);
  const navigation = useNavigation();
  

  const handleLogOut = () => {
    const url = `http://127.0.0.1:8000/api/v1/auth/logout`;
    axios.post(url).then(() => {
      setSignedIn(false);
    });

    saveAuthStatus("isLoggedIn", "notLoggedin")
  };


  if (!signedIn){
    return (
      <Modal visible={!signedIn} animationType="slide">
        <WelcomeScreen />
      </Modal>
    );
  } else{
    return (
      <SafeAreaView>
        <ScrollView>
        <View>
          <View style={styles.topheader}>
            <Image
              source={require("../assets/images/me.jpg")}
              style={{
                width: 120,
                height: 120,
                borderRadius: 100,
                marginLeft: 20,
              }}
            />
            <View>
              <Text style={{ marginLeft: 20, fontSize: 30 }}>
                {user.username || "you're not signed in"}
              </Text>
              <Text style={{ marginLeft: 20, fontSize: 16, fontStyle: "italic" }}>
                {user.email || "No email found"}
              </Text>
              <View
                style={{
                  backgroundColor: "#1995AD",
                  marginLeft: 20,
                  marginRight: 20,
                  marginTop: 10,
                  height: 40,
                  borderRadius: 50,
                  width: 100,
                }}
              >
                <Button
                  title="Edit"
                  color="white"
                  style={{ fontSize: 10 }}
                  onPress={() => {
                    navigation.navigate("Personal Info");
                  }}
                />
              </View>
            </View>
          </View> 
  
  
            {/* Personal Info Details */}
          <Text
            style={{
              marginLeft: 20,
              fontSize: 20,
              marginTop: 20,
              marginBottom: 10,
              fontWeight: 500,
            }}
          >
            Account
          </Text>
          <View style={styles.settings}>
            <View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Personal Info");
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 15,
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <FontAwesome6 name="user-large" size={24} color="black" />
                    <Text style={{ fontSize: 20, marginLeft: 20 }}>
                      Edit Profile
                    </Text>
                  </View>
  
                  <Ionicons name="arrow-forward" size={24} color="black" />
                </View>
              </TouchableOpacity>
  
              {/* Security */}
  
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Personal Info");
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 15,
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <MaterialCommunityIcons
                      name="security"
                      size={24}
                      color="black"
                    />
                    <Text style={{ fontSize: 20, marginLeft: 20 }}>Security</Text>
                  </View>
  
                  <Ionicons name="arrow-forward" size={24} color="black" />
                </View>
              </TouchableOpacity>
  
              {/* Notification */}
  
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Personal Info");
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 15,
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <AntDesign name="notification" size={24} color="black" />
                    <Text style={{ fontSize: 20, marginLeft: 20 }}>
                      Notification
                    </Text>
                  </View>
  
                  <Ionicons name="arrow-forward" size={24} color="black" />
                </View>
              </TouchableOpacity>
  
              {/* Privacy */}
  
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Personal Info");
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 15,
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <MaterialIcons name="privacy-tip" size={24} color="black" />
                    <Text style={{ fontSize: 20, marginLeft: 20 }}>Privacy</Text>
                  </View>
  
                  <Ionicons name="arrow-forward" size={24} color="black" />
                </View>
              </TouchableOpacity>
            </View>
  
            
          </View>
  
  
            {/* Support & About */}
  
            <Text
            style={{
              marginLeft: 20,
              fontSize: 20,
              marginTop: 20,
              marginBottom: 10,
              fontWeight: 500,
            }}
          >
            Support & About
          </Text>
          <View style={styles.settings2}>
            <View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Personal Info");
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 15,
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                  <Entypo name="help" size={24} color="black" />
                    <Text style={{ fontSize: 20, marginLeft: 20 }}>
                      Help & Support
                    </Text>
                  </View>
  
                  <Ionicons name="arrow-forward" size={24} color="black" />
                </View>
              </TouchableOpacity>
  
              {/* Terms and Condition */}
  
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Personal Info");
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 15,
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                  <MaterialIcons name="policy" size={24} color="black" />
                    <Text style={{ fontSize: 20, marginLeft: 20 }}>Terms and Conditions</Text>
                  </View>
  
                  <Ionicons name="arrow-forward" size={24} color="black" />
                </View>
              </TouchableOpacity>
  
              {/* Report */}
  
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Personal Info");
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 15,
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                  <Octicons name="report" size={24} color="black" />
                    <Text style={{ fontSize: 20, marginLeft: 20 }}>
                      Report a problem
                    </Text>
                  </View>
  
                  <Ionicons name="arrow-forward" size={24} color="black" />
                </View>
              </TouchableOpacity>
            </View>
  
            
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
            <Button title="Log out" color="white" onPress={handleLogOut} />
          </View>
        </View>
        </ScrollView>
      </SafeAreaView>
    );

  }

};

export default ProfileScreen;

const styles = StyleSheet.create({
  topheader: {
    width: "100%",
    height: 150,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  settings: {
    backgroundColor: "rgb(255, 255, 255)",
    width: "95%",
    height: 230,
    margin: 10,
    borderRadius: 10,
  },
  settings2: {
    backgroundColor: "rgb(255, 255, 255)",
    width: "95%",
    height: 170,
    margin: 10,
    borderRadius: 10,
  },
});
