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
  TouchableOpacity
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
            fontWeight: "bold",
            marginTop: 10,
          }}
        >
          Reviews
        </Text>
        <FlatList
          data={data}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View
              style={{
                marginLeft: 20,
                marginTop: 20,
                borderColor: "rgb(200, 200, 200)",
                borderWidth: 0.5,
                padding: 4,
                borderRadius: 10,
                marginRight: 10,
                backgroundColor: "#ededed",
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
              width: "94%",
              borderWidth: 2,
              marginLeft: 20,
              marginTop: 10,
              marginRight: 10,
              padding: 10,
              fontSize: 17,
              marginBottom: 20,
              borderRadius: 10,
            }}
            multiline={true}
          />
          <TouchableOpacity>
          <View
            style={{
              width: "95%",
              backgroundColor: "#1995AD",
              height: 50,
              marginBottom: 20,
              marginLeft: 20,
              borderRadius: 10,
            }}
          >
            <Text style={{textAlign: "center", marginTop: 12, fontSize: 20, color: "white", fontWeight: "bold"}}>Post</Text>
          </View>
          </TouchableOpacity>
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
    marginBottom: 20,
  },
});
