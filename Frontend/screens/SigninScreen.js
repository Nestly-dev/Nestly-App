import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  ActivityIndicator
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";
import React, { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import UserContext from "../context/UserContext";




const SignInScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation("");
  const {setUser, setSignedIn} = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = () =>{
    if (!email || !password){
      alert("Please fill up all the details")
    } else{
      const url = "http://127.0.0.1:8000/api/v1/auth/login"
      const credentials ={
        "email": email,
        "password": password
      }
      setIsLoading(true)
      console.log(credentials);
      axios.post(url, credentials)
      .then((response) =>{
        const result = response.data
        console.log(result)
        const {message, user} = result
  
        if(message === "Login successful"){
          navigation.navigate("Main Page")
          setUser(user)
          setSignedIn(true)
          setIsLoading(false)

        } else{console.log("Login Failed")}
  
      })
      .catch((error) =>{
        console.log(error);
        alert("Check your Internet connection")
        setIsLoading(false)
      })
    }
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "White", alignItems: "center" }}
    >
      <View style={{ marginTop: 40, marginBottom: 20 }}>
        <Image
          style={{ width: 120, height: 120, marginBottom: 20 }}
          source={require("../assets/images/3.png")}
        />
      </View>

      <KeyboardAvoidingView>
        <View>
          <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 30 }}>
            Welcome Back!
          </Text>
        </View>
      </KeyboardAvoidingView>

      <KeyboardAvoidingView>
        <View style={{ marginTop: 20 }}>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              backgroundColor: "rgb(255,255,255)",
              borderColor: "rgb(233, 233, 233)",
              borderWidth: 2,
              width: "85%",
              marginLeft: 30,
          
         
              height: 60,
              padding: 10,
              borderRadius: 20,
            }}
          >
            <MaterialIcons name="email" size={24} color="black" />
            <TextInput
              placeholder="Email"
              value={email}
              style={{
                marginVertical: 10,
                color: "gray",
                fontSize: email ? 16 : 16,
                width: 330,
              }}
              onChangeText={(text) => {
                setEmail(text);
              }}
              autoCapitalize="none"
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              backgroundColor: "rgb(255,255,255)",
              borderColor: "rgb(233, 233, 233)",
              borderWidth: 2,
              width: "85%",
              marginLeft: 30,
              height: 60,
              padding: 10,
              borderRadius: 20,
              marginTop: 30,
            }}
          >
            <Entypo name="key" size={24} color="black" />
            <TextInput
              placeholder="Enter Your Password"
              secureTextEntry
              autoCapitalize="none"
              style={{
                marginVertical: 10,
                color: "gray",
                fontSize: password ? 16 : 16,
                width: 330,
              }}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
              }}
            />
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginTop: 15,
            alignItems: "center",
            justifyContent: "space-between",
            width: "85%",
              marginLeft: 30,
            marginTop: 10,
          }}
        >
          <Text>Keep Me Logged In</Text>
          <Text style={{ color: "#007FFF", fontWeight: 500 }}>
            Forgot Password
          </Text>
        </View>
        <View style={{ width: "90%", marginLeft: 30, }}>
          <Text style={{ marginTop: 20, textAlign:"center" }}>
            By Registaring you confirm that you accept our
            <Text style={{ color: "#1995AD" }}> Term of use</Text> and{" "}
            <Text style={{ color: "#1995AD" }}>Privacy Policy</Text>
          </Text>
        </View>
        <View style={{ marginTop: 30 }}>
          <Pressable
            onPress={handleSignIn}
            disabled={isLoading ? true : false}
            style={{
              backgroundColor: "#1995AD",
              width: "85%",
              borderRadius: 6,
              padding: 15,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
           {isLoading ? <ActivityIndicator color={"white"} size={20} /> : <Text
              style={{ textAlign: "center", fontSize: 16, fontWeight:"bold", color:"white" }}
            >
              Login
            </Text>}
          </Pressable>
          <Pressable
            onPress={() => {
              navigation.navigate("SignUp");
            }}
            style={{ marginTop: 20 }}
          >
            <Text style={{ textAlign: "center", fontWeight: 500 }}>
              Don't Have an Account? <Text style={{color:"#1995AD", fontWeight:"600"}}>SignUp</Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({});
