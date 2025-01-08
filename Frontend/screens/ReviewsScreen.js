import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  FlatList,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import React from "react";
import { data } from "../data/reviewdata";

const ReviewsScreen = () => {
  return (
    <SafeAreaView>
      <ScrollView>
        <Text
          style={{
            fontSize: 30,
            marginLeft: 20,
            fontWeight: 500,
            marginTop: 10,
          }}
        >
          Reviews
        </Text>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <View
              style={{
                marginLeft: 20,
                marginTop: 20,
                borderColor: "gray",
                borderWidth: 0.5,
                padding: 4,
                borderRadius: 20,
                marginRight: 10,
                backgroundColor: "#ededed",
                shadowColor: "#000",
                shadowOffset: {width: 0, height: 3},
                shadowOpacity: 1
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Image source={{ uri: item.profile }} style={styles.rate} />
                <View>
                  <Text
                    style={{
                      marginLeft: 20,
                      fontWeight: 500,
                      fontSize: 20,
                    }}
                  >
                    {item.name}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      marginLeft: 20,
                      marginTop: 5,
                    }}
                  >
                    <Text>{item.date}</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.review}>{item.review}</Text>
            </View>
          )}
        />
        <KeyboardAvoidingView>
          <TextInput
            placeholder="Comment..."
            style={{
              height: 100,
              borderColor: 30,
              width: "100%",
              borderWidth: 2,
              marginLeft: 20,
              marginTop: 10,
              marginRight: 10,
              padding: 10,
              fontSize: 17,
              marginBottom: 40,
              borderRadius: 20,
            }}
          />
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReviewsScreen;

const styles = StyleSheet.create({
  rate: {
    width: 50,
    height: 50,
    borderRadius: 100,
    marginLeft: 10,
  },
  review: {
    marginTop: 10,
    marginLeft: 10,
    fontSize: 18,
    width: "95%",
  },
});
