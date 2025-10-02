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
  Alert,
  TouchableOpacity
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";
import React, { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AuthContext from "../context/AuthContext";

const SignInScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const { login: contextLogin, ip } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    // Validation
    if (!email || !password) {
      Alert.alert("Error", "Please fill up all the details");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    const url = `http://${ip}:8000/api/v1/auth/login`;
    const credentials = {
      email: email.trim().toLowerCase(),
      password: password
    };

    setIsLoading(true);

    try {
      const response = await axios.post(url, credentials);
      const result = response.data;

      if (result.success && result.data) {
        const { token, user } = result.data;

        // Save to context (which also saves to SecureStore)
        // Navigation will happen automatically via AppNavigation when isAuthenticated changes
        await contextLogin(token, user);

      } else {
        Alert.alert("Login Failed", result.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        const status = error.response.status;
        const errorMessage = error.response.data?.message;

        if (status === 401) {
          Alert.alert("Login Failed", errorMessage || "Invalid email or password");
        } else if (status === 403) {
          Alert.alert(
            "Account Not Verified",
            errorMessage || "Please check your email to verify your account before logging in."
          );
        } else {
          Alert.alert("Error", errorMessage || "Login failed. Please try again");
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
            Welcome Back!
          </Text>
        </View>
      </KeyboardAvoidingView>

      <KeyboardAvoidingView>
        <View style={{ marginTop: 20 }}>
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

          <View style={[styles.inputContainer, { marginTop: 30 }]}>
            <Entypo name="key" size={24} color="black" />
            <TextInput
              placeholder="Enter Your Password"
              secureTextEntry
              autoCapitalize="none"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>

        <View style={styles.optionsContainer}>
          <Text>Keep Me Logged In</Text>
          <Text style={{ color: "#007FFF", fontWeight: "500" }}>
            Forgot Password?
          </Text>
        </View>

        <View style={{ width: "90%", marginLeft: 30 }}>
          <Text style={{ marginTop: 20, textAlign: "center" }}>
            By logging in you confirm that you accept our
            <Text style={{ color: "#1995AD" }}> Terms of Use</Text> and{" "}
            <Text style={{ color: "#1995AD" }}>Privacy Policy</Text>
          </Text>
        </View>

        <View style={{ marginTop: 30 }}>
          <Pressable
            onPress={handleSignIn}
            disabled={isLoading}
            style={[styles.button, isLoading && styles.buttonDisabled]}
          >
            {isLoading ? (
              <ActivityIndicator color={"white"} size={20} />
            ) : (
              <Text style={styles.buttonText}>Login to your Account</Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate("SignUp")}
            style={{ marginTop: 20 }}
          >
            <Text style={{ textAlign: "center", fontWeight: "500", fontSize: 15 }}>
              Don't Have An Account?{" "}
              <Text style={{ color: "#1995AD", fontWeight: "bold" }}>Register</Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  inputContainer: {
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
  },
  input: {
    flex: 1,
    marginVertical: 10,
    color: "gray",
    fontSize: 16,
  },
  optionsContainer: {
    flexDirection: "row",
    marginTop: 15,
    alignItems: "center",
    justifyContent: "space-between",
    width: "85%",
    marginLeft: 30,
    marginTop: 10,
  },
  button: {
    backgroundColor: "#1995AD",
    width: "85%",
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