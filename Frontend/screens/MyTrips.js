import React, { useEffect, useContext, useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  Pressable, 
  TouchableOpacity, 
  Modal, 
  StatusBar,
  Dimensions,
  ActivityIndicator
} from "react-native";
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
  const { signedIn } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
      </View>
    );
  }

  if (!signedIn) {
    return (
      <Modal visible={true} animationType="slide">
        <WelcomeScreen />
      </Modal>
    );
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsLoading(true);
    // Simulate loading data
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F1F1F2" />
      <LinearGradient
        colors={["#F1F1F2", "#F1F1F2", "#F1F1F2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.headerText}>My Trips</Text>
          </View>
          
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'upcoming' && styles.activeTabButton]}
              onPress={() => handleTabChange('upcoming')}
            >
              <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
                Upcoming
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'finished' && styles.activeTabButton]}
              onPress={() => handleTabChange('finished')}
            >
              <Text style={[styles.tabText, activeTab === 'finished' && styles.activeTabText]}>
                Finished
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'favorites' && styles.activeTabButton]}
              onPress={() => handleTabChange('favorites')}
            >
              <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>
                Favorites
              </Text>
            </TouchableOpacity>
          </View>
          
          {isLoading ? (
            <View style={styles.loadingView}>
              <ActivityIndicator size="small" color="#0066CC" />
            </View>
          ) : (
            <Reservations font={loaded} tripType={activeTab} />
          )}
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    color: "#000",
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "Inter",
  },
  tabContainer: {
    height: 56,
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 28,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.05)",
    padding: 4,
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
  },
  activeTabButton: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 15,
    color: "#666",
    fontFamily: "Inter",
  },
  activeTabText: {
    color: "#000",
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1F1F2",
  },
  loadingView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});