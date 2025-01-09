import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  Button,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useContext } from "react";
import UserContext from "../context/UserContext";

const ProfileScreen = () => {

  const {user} = useContext(UserContext)

  return (
    <SafeAreaView>
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
            <Text style={{ marginLeft: 20, fontSize: 30 }}>{user.username}</Text>
            <Text style={{ marginLeft: 20, fontSize: 16, fontStyle:"italic" }}>{user.email}</Text>
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
              <Button title="Edit" color="white" style={{ fontSize: 10 }} />
            </View>
          </View>
        </View>
        <View style={styles.settings}>
          {/* Personal Info Details */}
          <TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 30,
              }}
            >
              <Text style={{ fontSize: 20 }}>Personal Info</Text>

              <Ionicons name="arrow-forward" size={24} color="black" />
            </View>
          </TouchableOpacity>
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
          <Button title="Log out" color="white" />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  topheader: {
    width: "100%",
    height: 150,
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  settings: {
    backgroundColor: "rgb(255, 255, 255)",
    width: "95%",
    height: 300,
    margin: 10,
    borderRadius: 20,
  },
});
