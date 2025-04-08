import { StyleSheet, Text, View, Image,  Modal, Pressable } from "react-native";
import React, { useState } from "react";
import SignInScreen from "./SigninScreen";
import SignUpScreen from "./SignUpScreen";

const WelcomeScreen = () => {
  const [showSignIn, setShowSignIn] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)
  const OpenSignIn = () => {
    setShowSignIn(true)
  };
  const OpenSignUp = () =>{
    setShowSignUp(true)
  }

  if(showSignIn){
    return <Modal visible={showSignIn} animationType="slide">
    <SignInScreen />
  </Modal>
  }
    if(showSignUp) {
    return <Modal visible={showSignUp} animationType="slide">
    <SignUpScreen />
  </Modal>
  }

  return (
    <View style={{ height: "100%" }}>
      <Image
        source={require("../assets/images/locck.jpg")}
        style={{ width: "100%", height: "100%", position: "absolute" }}
      />
      <View style={{ top: "15%", marginBottom: 20, alignItems: "center" }}>
        <Image
          style={{ width: 120, height: 120, marginBottom: 20 }}
          source={require("../assets/images/3.png")}
        />
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            marginBottom: 30,
            color: "white",
          }}
        >
          Welcome To Via
        </Text>

        
        <View style={{ flexDirection: "row" }}>
        <Pressable onPress={OpenSignIn}>
          <View
            style={{
              backgroundColor: "#1995AD",
              padding: 10,
              width: 150,
              borderRadius: 10,
              height: 60,
              shadowColor: "#000",
              shadowRadius: 2,
              shadowOffset:{width: 0, height: 2},
              shadowOpacity: 10
            }}
          >
            <Text style={{textAlign:"center", top: "15%", fontSize: 20, fontWeight: 500, color:"white"}}>SignIn</Text>
          </View>
        </Pressable>

          <Pressable onPress={OpenSignUp}>
          <View
            style={{
              backgroundColor: "#1995AD",
              padding: 15,
              width: 150,
              marginLeft: 40,
              borderRadius: 10,
              height: 60,
              shadowColor: "#000",
              shadowRadius: 2,
              shadowOffset:{width: 0, height: 2},
              shadowOpacity: 10
            }}
          >
            <Text style={{textAlign:"center", fontSize: 20, fontWeight: 500, color:"white"}}>SignUp</Text>
          </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({});
