import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import DateTimePicker from "@react-native-community/datetimepicker";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import RoomItem from "../components/RoomItem";

const BookingScreen = ({ navigation, route }) => {
  // Get hotelId from route params or context (fallback to currentID)
  const { currentID, user, ip } = useContext(AuthContext);
  const hotelId = currentID;
  
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(
    new Date(Date.now() + 86400000)
  ); // Next day
  const [roomInfo, setRoomInfo] = useState([]);
  const [roomPrices, setRoomPrices] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [serviceFee] = useState(10);
  const [hotelName, setHotelName] = useState("");

  useEffect(() => {
    fetchHotelAndRoomInfo();
  }, []);

  const fetchHotelAndRoomInfo = async () => {
    if (!hotelId) {
      Alert.alert("Error", "Hotel information is missing. Please select a hotel first.");
      navigation.goBack();
      return;
    }
    
    try {
      // Fetch hotel details first to get hotel name
      const hotelResponse = await axios.get(`http://${ip}:8000/api/v1/hotels/profile/${hotelId}`);
      if (hotelResponse.data && hotelResponse.data.data) {
        setHotelName(hotelResponse.data.data.name);
      }

      // Fetch rooms for this hotel
      const roomsResponse = await axios.get(`http://${ip}:8000/api/v1/hotels/rooms/${hotelId}`);
      
      if (roomsResponse.data && roomsResponse.data.data) {
        const roomsData = roomsResponse.data.data;
        
        // Map the API response to match our expected format
        const formattedRooms = roomsData.map((room) => ({
          id: room.id, // Use the actual room ID from API
          type: room.type,
          description: room.description || "Comfortable room",
          max_occupancy: room.max_occupancy,
          num_beds: room.num_beds,
          room_size: room.room_size,
          total_inventory: room.total_inventory,
          available_inventory: room.available_inventory || room.total_inventory,
          roomFee: room.roomFee || "50000",
          serviceFee: room.serviceFee || "5000",
          currency: room.currency || "RWF"
        }));
        
        setRoomInfo(formattedRooms);
      }
    } catch (error) {
      console.error("Error fetching hotel/room info:", error);
      Alert.alert("Error", "Failed to load room information. Please try again.");
    }
  };

  const onChangeCheckIn = (e, selectedDate) => {
    if (selectedDate) {
      setCheckInDate(selectedDate);
      // Ensure checkout is after checkin
      if (selectedDate >= checkOutDate) {
        setCheckOutDate(new Date(selectedDate.getTime() + 86400000));
      }
    }
  };

  const onChangeCheckOut = (e, selectedDate) => {
    if (selectedDate && selectedDate > checkInDate) {
      setCheckOutDate(selectedDate);
    } else {
      Alert.alert("Invalid Date", "Check-out must be after check-in date");
    }
  };

  // FIXED: Function to update individual room prices using roomId as key
  const updateRoomPrice = (roomId, count, pricePerRoom) => {
    setRoomPrices((prev) => {
      const updatedPrices = {
        ...prev,
        [roomId]: {
          count: count,
          pricePerRoom: pricePerRoom,
          totalPrice: pricePerRoom * count,
          roomType: roomInfo.find(r => r.id === roomId)?.type || 'Unknown',
        },
      };
      return updatedPrices;
    });
  };

  // FIXED: Calculate total using totalPrice property
  useEffect(() => {
    const total = Object.values(roomPrices).reduce(
      (sum, room) => sum + (room.totalPrice || 0),
      0
    );
    setTotalPrice(total);
  }, [roomPrices]);

  const grandTotal = totalPrice + serviceFee;

  // Calculate number of nights
  const numberOfNights = Math.ceil(
    (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
  );

  const validateBooking = () => {
    if (totalPrice === 0) {
      Alert.alert("No Rooms Selected", "Please select at least one room");
      return false;
    }
    if (adults === 0) {
      Alert.alert("No Guests", "Please add at least one adult guest");
      return false;
    }
    if (checkInDate >= checkOutDate) {
      Alert.alert("Invalid Dates", "Check-out must be after check-in date");
      return false;
    }
    return true;
  };

  // FIXED: Prepare booking data with proper room information
  const onConfirm = () => {
    if (!validateBooking()) return;

    // Prepare booking data with all room details
    const selectedRooms = Object.entries(roomPrices)
      .filter(([_, data]) => data.count > 0)
      .map(([roomId, data]) => ({
        roomId: roomId,
        roomType: data.roomType,
        count: data.count,
        pricePerRoom: data.pricePerRoom,
        totalPrice: data.totalPrice,
      }));

    const bookingData = {
      hotel_id: hotelId,
      hotel_name: hotelName,
      check_in_date: checkInDate.toISOString(),
      check_out_date: checkOutDate.toISOString(),
      adults: adults,
      children: children,
      rooms: selectedRooms,
      nights: numberOfNights,
      total_price: totalPrice,
      service_fee: serviceFee,
      grand_total: grandTotal,
    };

    // Debug: Log booking data to verify all rooms are included
    console.log("Booking Data:", JSON.stringify(bookingData, null, 2));

    // Navigate to payment screen
    navigation.navigate("Payment", {
      grandTotal: grandTotal,
      bookingData: bookingData,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Hotel Name */}
        <View style={styles.section}>
          <Text style={styles.hotelName}>{hotelName}</Text>
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Dates</Text>
          
          <View style={styles.dateContainer}>
            <View style={styles.dateBox}>
              <Text style={styles.dateLabel}>Check-in</Text>
              <DateTimePicker
                value={checkInDate}
                mode="date"
                display="default"
                onChange={onChangeCheckIn}
                minimumDate={new Date()}
                style={styles.datePicker}
              />
            </View>

            <View style={styles.dateBox}>
              <Text style={styles.dateLabel}>Check-out</Text>
              <DateTimePicker
                value={checkOutDate}
                mode="date"
                display="default"
                onChange={onChangeCheckOut}
                minimumDate={new Date(checkInDate.getTime() + 86400000)}
                style={styles.datePicker}
              />
            </View>
          </View>

          <Text style={styles.nightsText}>
            {numberOfNights} {numberOfNights === 1 ? "night" : "nights"}
          </Text>
        </View>

        {/* Room Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Rooms</Text>
          {roomInfo && roomInfo.length > 0 ? (
            <FlatList
              data={roomInfo}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <RoomItem item={item} updateRoomPrice={updateRoomPrice} />
              )}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.noRoomsText}>No rooms available</Text>
          )}
        </View>

        {/* Guest Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Guests</Text>
          
          <View style={styles.guestRow}>
            <Text style={styles.guestLabel}>Adults</Text>
            <View style={styles.counterContainer}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => adults > 1 && setAdults(adults - 1)}
              >
                <Entypo name="minus" size={20} color="white" />
              </TouchableOpacity>
              <Text style={styles.counterText}>{adults}</Text>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setAdults(adults + 1)}
              >
                <Entypo name="plus" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.guestRow}>
            <Text style={styles.guestLabel}>Children</Text>
            <View style={styles.counterContainer}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => children > 0 && setChildren(children - 1)}
              >
                <Entypo name="minus" size={20} color="white" />
              </TouchableOpacity>
              <Text style={styles.counterText}>{children}</Text>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setChildren(children + 1)}
              >
                <Entypo name="plus" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Price Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Details</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Room Fee</Text>
            <Text style={styles.priceValue}>
              {user?.preferred_currency || "RWF"} {totalPrice.toLocaleString()}
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Service Fee</Text>
            <Text style={styles.priceValue}>
              {user?.preferred_currency || "RWF"} {serviceFee.toLocaleString()}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total Price</Text>
            <Text style={styles.totalValue}>
              {user?.preferred_currency || "RWF"} {grandTotal.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Confirm Button */}
        <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
          <Text style={styles.confirmButtonText}>Proceed to Payment</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  section: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 15,
    padding: 20,
    borderRadius: 12,
  },
  hotelName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 15,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateBox: {
    flex: 1,
    marginHorizontal: 5,
  },
  dateLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  datePicker: {
    width: "100%",
  },
  nightsText: {
    fontSize: 16,
    color: "#1995AD",
    marginTop: 10,
    fontWeight: "500",
  },
  noRoomsText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    padding: 20,
  },
  guestRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  guestLabel: {
    fontSize: 18,
    fontWeight: "500",
    color: "#000",
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  counterButton: {
    backgroundColor: "#1995AD",
    borderRadius: 8,
    padding: 8,
  },
  counterText: {
    fontSize: 18,
    color: "#000",
    marginHorizontal: 20,
    minWidth: 30,
    textAlign: "center",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 16,
    color: "#666",
  },
  priceValue: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 15,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1995AD",
  },
  confirmButton: {
    backgroundColor: "#1995AD",
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 30,
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});