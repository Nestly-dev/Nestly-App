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
import React, { useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import axios from "axios";
import AuthContext from "../context/AuthContext";

const SignUpScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation("");
  const {setUser, setSignedIn, setAuthStatus, saveAuthStatus, saveUserDetails} = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false)

  const handleSignUp = () =>{
    if (!email || !password){
      alert("Please fill up all the details")
    } else{
      const url = "http://127.0.0.1:8000/api/v1/auth/register"
      const credentials ={
        "username": name,
        "email": email,
        "password": password
      };
      setIsLoading(true);
      console.log(credentials);
      axios.post(url, credentials)
      .then((response) =>{
        const result = response.data;
        console.log(result);
        const {message, user} = result;
  
        if(message === "User registered successfully. Please check your email to verify your account."){
          setUser(user);
          setSignedIn(true);
          setIsLoading(false);
          setAuthStatus("loggedIn");
          saveAuthStatus("isLoggedIn", "loggedIn");
          saveUserDetails("CurrentUser", user);

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
      <View style={{marginTop: 40, marginBottom: 20}}>
        <Image
          style={{ width: 120, height: 120, marginBottom: 20 }}
          source={require("../assets/images/3.png")}
        />
      </View>

      <KeyboardAvoidingView>
        <View>
          <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 30 }}>
            Register to your Account
          </Text>
        </View>
      </KeyboardAvoidingView>

      <KeyboardAvoidingView>
        <View>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              backgroundColor: "rgb(255,255,255)",
              borderColor:"rgb(233, 233, 233)",
              borderWidth:2,
              width: "87%",
              marginLeft: 25,
              height: 60,
              padding: 10,
              borderRadius: 20,
            }}
          >
            <FontAwesome name="user" size={24} color="black" />
            <TextInput
              placeholder="Username"
              value={name}
              style={{
                marginVertical: 10,
                color: "gray",
                fontSize: email ? 16 : 16,
                width: 330,
              }}
              onChangeText={(text) => {
                setName(text);
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              backgroundColor: "rgb(255,255,255)",
              borderColor:"rgb(233, 233, 233)",
              borderWidth:2,
              width: "87%",
              marginLeft: 25,
              height: 60,
              padding: 10,
              borderRadius: 20,
              marginTop: 10,
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
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              backgroundColor: "rgb(255,255,255)",
              borderColor:"rgb(233, 233, 233)",
              borderWidth:2,
              width: "87%",
              marginLeft: 25,
              height: 60,
              padding: 10,
              borderRadius: 20,
              marginTop: 10,
            }}
          >
            <Entypo name="key" size={24} color="black" />
            <TextInput
              placeholder="Enter Your Password"
              secureTextEntry
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
            
            justifyContent: "space-between",
            width: "90%",
            marginLeft: "8%",
            marginTop: 20
          }}
        >
          <Text>Keep Me Logged In</Text>
          <Text style={{ color: "#007FFF", fontWeight: 500 }}>
            Forgot Password
          </Text>
        </View>
        <View style={{ width: "87%", marginLeft: "10%" }}>
          <Text style={{ marginTop: 20, textAlign:"center"}}>
            By Registaring you confirm that you accept our
            <Text style={{ color: "#1995AD" }}> Term of use</Text> and{" "}
            <Text style={{ color: "#1995AD" }}>Privacy Policy</Text>
          </Text>
        </View>
        <View style={{ marginTop: 30 }}>
          <Pressable
            style={{
              backgroundColor: "#1995AD",
              width: "87%",
              borderRadius: 6,
              padding: 15,
              marginLeft: "auto",
              marginRight: "auto",
            }}
            onPress={handleSignUp}
            disabled={isLoading}
          >
            {isLoading ? <ActivityIndicator color={"white"} size={20} /> : <Text
              style={{ textAlign: "center", fontSize: 16, fontWeight:"bold", color:"white" }}
            >Create Your Account</Text>}
          </Pressable>
          <Pressable
            onPress={() => {
              navigation.navigate("SignIn");
            }}
            style={{ marginTop: 20 }}
          >
            <Text style={{ textAlign: "center", fontWeight: 500, fontSize: 15 }}>
              Already Have An Account? <Text style={{color:"#1995AD", fontWeight:"bold"}}>LogIn</Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({});
