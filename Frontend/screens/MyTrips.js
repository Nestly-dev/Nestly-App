import React, {useEffect, useContext} from "react";
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Pressable, TouchableOpacity, Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Reservations from "../components/Reservations";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from 'expo-font';
import WelcomeScreen from "./WelcomeScreen";
import AuthContext from "../context/AuthContext";

SplashScreen.preventAutoHideAsync();

export default function App() {

  const [loaded, error] = useFonts({
    'Poppins': require('../assets/fonts/Poppins-Regular.ttf'),
    'Inter': require('../assets/fonts/Inter-VariableFont_opsz,wght.ttf'),
  });
  const {signedIn} = useContext(AuthContext)

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  if(!signedIn){
    return (
      <Modal visible={true} animationType="slide">
        <WelcomeScreen />
      </Modal>)
  } else {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={["#F1F1F2", "#F1F1F2", "#F1F1F2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <ScrollView>
            <SafeAreaView>
              <View
                style={{ justifyContent: "space-between", alignItems: "center" }}
              >
                <Text style={styles.text}>My Trips</Text>
              </View>
              <View
                style={{
                  height: 60,
                  margin: 30,
                  borderRadius: 30,
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                  backgroundColor: "rgba(0,0,0,0.05)",
                
                }}
              >
                <TouchableOpacity><Pressable><Text style={{margin:20, fontSize:15, color:"black", fontFamily:"Inter"}}>Upcoming</Text></Pressable></TouchableOpacity>
                <TouchableOpacity><Pressable><Text style={{margin:20, fontSize:15, color:"black", fontFamily:"Inter"}}>Finished</Text></Pressable></TouchableOpacity>
                <TouchableOpacity><Pressable><Text style={{margin:20, fontSize:15, color:"black", fontFamily:"Inter"}}>Favorites</Text></Pressable></TouchableOpacity>
              </View>
              <Reservations font={loaded}/>
            </SafeAreaView>
          </ScrollView>
        </LinearGradient>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  gradient: {
    flex: 1,
  },
  text: {
    color: "#000",
    fontSize: 25,
    fontWeight: "bold",
    fontFamily:"Inter"
  },
});
