import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert
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
  const navigation = useNavigation();
  const { ip } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    // Validation
    if (!email || !password || !name) {
      Alert.alert("Error", "Please fill up all the details");
      return;
    }

    if (name.trim().length < 2) {
      Alert.alert("Error", "Name must be at least 2 characters");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }

    const url = `http://${ip}:8000/api/v1/auth/register`;
    const credentials = {
      username: name.trim(),
      email: email.trim().toLowerCase(),
      password: password
    };

    setIsLoading(true);

    try {
      const response = await axios.post(url, credentials);
      const result = response.data;

      if (result.success && (result.status === 201 || result.message?.includes("registered successfully"))) {
        Alert.alert(
          "Success!",
          "Registration successful! Please check your email to verify your account before logging in.",
          [
            {
              text: "OK",
              onPress: () => {
                // Clear form
                setName("");
                setEmail("");
                setPassword("");
                navigation.navigate("SignIn");
              }
            }
          ]
        );
      } else {
        Alert.alert("Registration Failed", result.message || "Please try again");
      }
    } catch (error) {
      console.error("Registration error:", error);

      if (error.response) {
        const errorMessage = error.response.data?.message || "Registration failed";

        if (error.response.status === 401 && errorMessage.includes("already exists")) {
          Alert.alert("Account Already Exists", "This email is already registered. Please sign in instead.");
        } else {
          Alert.alert("Error", errorMessage);
        }
      } else if (error.request) {
        Alert.alert("Network Error", "Please check your internet connection and try again");
      } else {
        Alert.alert("Error", "Something went wrong. Please try again");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "White", alignItems: "center" }}>
      <View style={{ marginTop: 40, marginBottom: 20 }}>
        <Image
          style={{ width: 120, height: 120, marginBottom: 20 }}
          source={require("../assets/images/3.png")}
        />
      </View>

      <KeyboardAvoidingView>
        <View>
          <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 30 }}>
            Register Your Account
          </Text>
        </View>
      </KeyboardAvoidingView>

      <KeyboardAvoidingView>
        <View>
          <View style={styles.inputContainer}>
            <FontAwesome name="user" size={24} color="black" />
            <TextInput
              placeholder="Username"
              value={name}
              style={styles.input}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={24} color="black" />
            <TextInput
              placeholder="Email"
              value={email}
              style={styles.input}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Entypo name="key" size={24} color="black" />
            <TextInput
              placeholder="Enter Your Password (min 8 characters)"
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={{ width: "87%", marginLeft: "10%", marginTop: 20 }}>
          <Text style={{ textAlign: "center" }}>
            By Registering you confirm that you accept our
            <Text style={{ color: "#1995AD" }}> Terms of Use</Text> and{" "}
            <Text style={{ color: "#1995AD" }}>Privacy Policy</Text>
          </Text>
        </View>

        <View style={{ marginTop: 30 }}>
          <Pressable
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={"white"} size={20} />
            ) : (
              <Text style={styles.buttonText}>Create Your Account</Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate("SignIn")}
            style={{ marginTop: 20 }}
          >
            <Text style={{ textAlign: "center", fontWeight: "500", fontSize: 15 }}>
              Already Have An Account?{" "}
              <Text style={{ color: "#1995AD", fontWeight: "bold" }}>LogIn</Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    backgroundColor: "rgb(255,255,255)",
    borderColor: "rgb(233, 233, 233)",
    borderWidth: 2,
    width: "87%",
    marginLeft: 25,
    height: 60,
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
  },
  input: {
    flex: 1,
    marginVertical: 10,
    color: "gray",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#1995AD",
    width: "87%",
    borderRadius: 6,
    padding: 15,
    marginLeft: "auto",
    marginRight: "auto",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});
