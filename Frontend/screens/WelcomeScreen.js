import { StyleSheet, Text, View, Image, Button, Modal } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import SignInScreen from "./SigninScreen";
import SignUpScreen from "./SignUpScreen";

const WelcomeScreen = () => {
  const navigation = useNavigation();
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
          Welcome To Nestly
        </Text>
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              backgroundColor: "#1995AD",
              padding: 10,
              width: 150,
              borderRadius: 10,
            }}
          >
            <Button
              title="SignIn"
              color={"white"}
              onPress={OpenSignIn}
            />
          </View>
          <View
            style={{
              backgroundColor: "#1995AD",
              padding: 10,
              width: 150,
              marginLeft: 40,
              borderRadius: 10,
            }}
          >
            <Button
              title="SignUp"
              color={"white"}
              onPress={OpenSignUp}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({});
