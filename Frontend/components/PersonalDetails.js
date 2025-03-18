import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Button,
  Image,
  ScrollView,
  SafeAreaView
} from "react-native";
import React, { useState, useContext } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import {BASEURL} from "@env"

const PersonalDetails = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [avatar, setAvatar] = useState("");
  const [language, setLanguage] = useState("");
  const [currency, setCurrency] = useState("");
  const [isFirstTime, setIsFirstTime] = useState(false)
  const {user} = useContext(AuthContext)
  const onChangeBirthdate = (e, selectedDate) => {
    setBirthDate(selectedDate);
  };

  const changedToUsd = () => {
    Toast.show({
      type: "success",
      text1: "Currency Changed to:",
      text2: "USD",
    });
    setCurrency("USD");
  };
  const changedToFrw = () => {
    Toast.show({
      type: "success",
      text1: "Currency Changed to:",
      text2: "FRW",
    });
    setCurrency("FRW");
  };
  const infoSaved = () => {
    Toast.show({
      type: "success",
      text1: "Your Profile has been updated",
      text2: "Complete 💯",
    });
    setCurrency("FRW");
  };


  const handleSubmit = () =>{
    
    if(isFirstTime){
    const url = `http://172.20.10.4:8000/api/v1/profile/register`
    const info ={
    "first_name": firstName,
    "last_name": lastName,
    "phone_number": phoneNumber,
    "date_of_birth":birthDate,
    "avatar_url": "kevin_pic",
    "preferred_language": "en",
    "preferred_currency": currency
    }

    axios.post(url, info)
    .then(() =>{
        infoSaved;
        setIsFirstTime(false)
    }).catch(error =>{
        console.log(error);
    })
    } else{
      const updateUrl = `http://172.20.10.4:8000/api/v1/profile/update/${user.id}`
      const updateInfo ={
        "first_name": firstName,
        "last_name": lastName,
        "phone_number": phoneNumber,
        "date_of_birth":birthDate,
        "avatar_url": "kevin_pic",
        "preferred_language": "en",
        "preferred_currency": currency
        }

        axios.patch(updateUrl, updateInfo)
        .then(
          infoSaved
        )
        .catch(error => {
          console.log(error);
        })

    }
  }

  return (
    <>
    <Toast style={{flex:1}}/>
    <SafeAreaView></SafeAreaView>
    <ScrollView>
      
      <View style={{ alignItems: "center", marginTop: "2%" }}>
        <Text
          style={{
            fontSize: 26,
            fontWeight: "bold",
            marginBottom: 30,
            color: "#1995AD",
          }}
        >
          Edit Profile
        </Text>

        {/* Profile Picture */}
        <View>
          <Image
            source={require("../assets/images/me.jpg")}
            style={{
              width: 120,
              height: 120,
              borderRadius: 100,
            }}
          />

          <View>
            <Button title="Change Photo" color="#1995AD" />
          </View>
        </View>
        {/* First Name Input */}
        <Text style={{alignSelf:"flex-start", marginLeft:"10%", fontSize: 18, fontWeight: 500, marginTop: 20}}>First Name</Text>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            backgroundColor: "rgb(255,255,255)",
            borderColor: "rgb(233, 233, 233)",
            borderWidth: 2,
            width: "85%",
            height: 60,
            padding: 10,
            borderRadius: 20,
            marginTop: 15,
          }}
        >
          <TextInput
            placeholder="First Name"
            style={{
              marginVertical: 10,
              color: "gray",
              fontSize: lastName ? 16 : 16,
              width: 330,
            }}
            value={firstName}
            onChangeText={text => setFirstName(text)}
          />
        </View>

        {/* Second Name Input */}
        <Text style={{alignSelf:"flex-start", marginLeft:"10%", fontSize: 18, fontWeight: 500, marginTop: 20}}>Last Name</Text>

        <View
          style={{
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            backgroundColor: "rgb(255,255,255)",
            borderColor: "rgb(233, 233, 233)",
            borderWidth: 2,
            width: "85%",
            height: 60,
            padding: 10,
            borderRadius: 20,
            marginTop: 15,
          }}
        >
          <TextInput
            placeholder="Second Name"
            style={{
              marginVertical: 10,
              color: "gray",
              fontSize: firstName ? 16 : 16,
              width: 330,
            }}
            value={lastName}
            onChangeText={text => setLastName(text)}
          />
        </View>

        {/* Phone Input */}
        <Text style={{alignSelf:"flex-start", marginLeft:"10%", fontSize: 18, fontWeight: 500, marginTop: 20}}>Phone</Text>

        <View
          style={{
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            backgroundColor: "rgb(255,255,255)",
            borderColor: "rgb(233, 233, 233)",
            borderWidth: 2,
            width: "85%",
            height: 60,
            padding: 10,
            borderRadius: 20,
            marginTop: 15,
          }}
        >
          <TextInput
            placeholder="Phone Number(+1)"
            style={{
              marginVertical: 10,
              color: "gray",
              fontSize: phoneNumber ? 16 : 16,
              width: 330,
            }}
            value={phoneNumber}
            onChangeText={text => setPhoneNumber(text)}
          />
        </View>

        {/* Birthday Input */}
        <Text style={{alignSelf:"flex-start", marginLeft:"10%", fontSize: 18, fontWeight: 500, marginTop: 20}}>Birthday</Text>

        <View
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            marginTop: 15,
            gap: "40%",
            backgroundColor: "rgb(255,255,255)",
            borderColor: "rgb(233, 233, 233)",
            borderWidth: 2,
            width: "85%",
            height: 60,
            padding: 10,
            borderRadius: 20,
          }}
        >
          <Text style={{ fontSize: 16, color: "gray" }}>Birthday</Text>
          <DateTimePicker
            value={birthDate}
            date="date"
            is24Hour={true}
            onChange={onChangeBirthdate}
          />
        </View>

        {/* Currency Input */}
        <Text style={{alignSelf:"flex-start", marginLeft:"10%", fontSize: 18, fontWeight: 500, marginTop: 20}}>Preffered Currency</Text>

        <View
          style={{
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            backgroundColor: "rgb(255,255,255)",
            borderColor: "rgb(233, 233, 233)",
            borderWidth: 2,
            width: "85%",
            height: 60,
            padding: 10,
            borderRadius: 20,
            marginTop: 15,
            justifyContent: "space-between",
          }}
        >
          <Text>Currency</Text>
          <View style={{ flexDirection: "row" }}>
            <View>
              <Button title="USD" onPress={changedToUsd} color="#1995AD" />
            </View>
            <View>
              <Button title="FRW" onPress={changedToFrw} color="#1995AD" />
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
        onPress={handleSubmit}
          style={{
            backgroundColor: "#1995AD",
            marginTop: 25,
            width: "85%",
            height: 50,
            borderRadius: 10,
          }}
        >
          <View style={{ padding: 10, alignItems: "center" }}>
            <Text style={{ fontSize: 20, color: "white", fontWeight: "bold" }}>
              Save
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </>
  );
};

export default PersonalDetails;

const styles = StyleSheet.create({});
