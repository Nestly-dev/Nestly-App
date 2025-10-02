import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const PaymentScreen = ({ route, navigation }) => {
  const { grandTotal, bookingData } = route.params;
  const { user, ip } = useContext(AuthContext);
  
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Card payment states
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  
  // Mobile money states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState(null);

  const paymentMethods = [
    { id: 'card', name: 'Card Payment', icon: 'card', color: '#4A90E2' },
    { id: 'mtn', name: 'MTN Mobile Money', icon: 'cellphone', color: '#FFCC00' },
    { id: 'airtel', name: 'Airtel Money', icon: 'cellphone-wireless', color: '#FF0000' },
  ];

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19);
  };

  const formatExpiryDate = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const formatPhoneNumber = (text) => {
    // Format to Rwanda phone number (e.g., 250788123456)
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      return '250' + cleaned.substring(1);
    }
    if (!cleaned.startsWith('250')) {
      return '250' + cleaned;
    }
    return cleaned.substring(0, 12);
  };

  const validateCardPayment = () => {
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 13) {
      Alert.alert('Invalid Card', 'Please enter a valid card number');
      return false;
    }
    if (!expiryDate || expiryDate.length < 5) {
      Alert.alert('Invalid Expiry', 'Please enter a valid expiry date (MM/YY)');
      return false;
    }
    if (!cvv || cvv.length < 3) {
      Alert.alert('Invalid CVV', 'Please enter a valid CVV');
      return false;
    }
    if (!cardholderName) {
      Alert.alert('Invalid Name', 'Please enter the cardholder name');
      return false;
    }
    return true;
  };

  const validateMobileMoneyPayment = () => {
    if (!phoneNumber || phoneNumber.length < 12) {
      Alert.alert('Invalid Phone', 'Please enter a valid Rwanda phone number');
      return false;
    }
    if (!selectedNetwork) {
      Alert.alert('Select Network', 'Please select MTN or Airtel');
      return false;
    }
    return true;
  };

  const processCardPayment = async () => {
    if (!validateCardPayment()) return;

    setLoading(true);
    try {
      const [month, year] = expiryDate.split('/');
      
      const payload = {
        amount: grandTotal,
        currency: user?.preferred_currency || 'RWF',
        email: user?.email,
        phone_number: user?.phone_number || phoneNumber,
        name: cardholderName,
        card_number: cardNumber.replace(/\s/g, ''),
        cvv: cvv,
        expiry_month: month,
        expiry_year: '20' + year,
        redirect_url: 'https://your-app.com/payment/callback',
        meta: {
          booking_id: bookingData?.booking_id,
          hotel_id: bookingData?.hotel_id,
        },
      };

      const response = await axios.post(
        `http://${ip}:8000/api/payment/card`,
        payload
      );

      if (response.data.status === 'success') {
        Alert.alert(
          'Payment Successful',
          'Your payment has been processed successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('BookingConfirmation', {
                transactionData: response.data.data,
              }),
            },
          ]
        );
      } else if (response.data.status === 'pending') {
        // Handle 3D Secure or additional authentication
        Alert.alert(
          'Additional Authentication Required',
          response.data.message,
          [
            {
              text: 'OK',
              onPress: () => {
                // Open authentication URL in browser
                // Linking.openURL(response.data.data.auth_url);
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        'Payment Failed',
        error.response?.data?.message || 'An error occurred during payment'
      );
    } finally {
      setLoading(false);
    }
  };

  const processMobileMoneyPayment = async () => {
    if (!validateMobileMoneyPayment()) return;

    setLoading(true);
    try {
      const payload = {
        amount: grandTotal,
        currency: user?.preferred_currency || 'RWF',
        email: user?.email,
        phone_number: phoneNumber,
        name: user?.username,
        network: selectedNetwork,
        redirect_url: 'https://your-app.com/payment/callback',
        meta: {
          booking_id: bookingData?.booking_id,
          hotel_id: bookingData?.hotel_id,
        },
      };

      const response = await axios.post(
        `http://${ip}:8000/api/payment/mobile-money`,
        payload
      );

      if (response.data.status === 'pending') {
        Alert.alert(
          'Payment Initiated',
          'Please check your phone and enter your PIN to complete the payment',
          [
            {
              text: 'Verify Payment',
              onPress: () => verifyPayment(response.data.data.tx_ref),
            },
          ]
        );
      } else if (response.data.status === 'success') {
        Alert.alert(
          'Payment Successful',
          'Your payment has been processed successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('BookingConfirmation', {
                transactionData: response.data.data,
              }),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        'Payment Failed',
        error.response?.data?.message || 'An error occurred during payment'
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (txRef) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://${ip}:8000/api/payment/verify/${txRef}`
      );

      if (response.data.status === 'success') {
        Alert.alert(
          'Payment Verified',
          'Your payment has been confirmed!',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('BookingConfirmation', {
                transactionData: response.data.data,
              }),
            },
          ]
        );
      } else {
        Alert.alert('Payment Verification Failed', 'Please try again or contact support');
      }
    } catch (error) {
      Alert.alert('Verification Error', 'Could not verify payment status');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    if (selectedMethod === 'card') {
      processCardPayment();
    } else if (selectedMethod === 'mtn' || selectedMethod === 'airtel') {
      setSelectedNetwork(selectedMethod);
      processMobileMoneyPayment();
    }
  };

  const renderPaymentMethodSelector = () => (
    <View style={styles.methodContainer}>
      <Text style={styles.sectionTitle}>Select Payment Method</Text>
      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.methodCard,
            selectedMethod === method.id && styles.methodCardSelected,
          ]}
          onPress={() => setSelectedMethod(method.id)}
        >
          <View style={styles.methodInfo}>
            <MaterialCommunityIcons
              name={method.icon}
              size={30}
              color={method.color}
            />
            <Text style={styles.methodName}>{method.name}</Text>
          </View>
          <View
            style={[
              styles.radioButton,
              selectedMethod === method.id && styles.radioButtonSelected,
            ]}
          >
            {selectedMethod === method.id && <View style={styles.radioButtonInner} />}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderCardPaymentForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.sectionTitle}>Card Details</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Card Number</Text>
        <TextInput
          style={styles.input}
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          onChangeText={(text) => setCardNumber(formatCardNumber(text))}
          keyboardType="numeric"
          maxLength={19}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
          <Text style={styles.inputLabel}>Expiry Date</Text>
          <TextInput
            style={styles.input}
            placeholder="MM/YY"
            value={expiryDate}
            onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
            keyboardType="numeric"
            maxLength={5}
          />
        </View>

        <View style={[styles.inputContainer, { flex: 1 }]}>
          <Text style={styles.inputLabel}>CVV</Text>
          <TextInput
            style={styles.input}
            placeholder="123"
            value={cvv}
            onChangeText={setCvv}
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Cardholder Name</Text>
        <TextInput
          style={styles.input}
          placeholder="John Doe"
          value={cardholderName}
          onChangeText={setCardholderName}
          autoCapitalize="words"
        />
      </View>
    </View>
  );

  const renderMobileMoneyForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.sectionTitle}>Mobile Money Details</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="250788123456"
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(formatPhoneNumber(text))}
          keyboardType="phone-pad"
          maxLength={12}
        />
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={20} color="#4A90E2" />
        <Text style={styles.infoText}>
          You will receive a prompt on your phone to complete the payment
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Amount Display */}
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Total Amount</Text>
          <Text style={styles.amountValue}>
            {user?.preferred_currency || 'RWF'} {grandTotal.toLocaleString()}
          </Text>
        </View>

        {/* Payment Method Selector */}
        {renderPaymentMethodSelector()}

        {/* Payment Form */}
        {selectedMethod === 'card' && renderCardPaymentForm()}
        {(selectedMethod === 'mtn' || selectedMethod === 'airtel') && renderMobileMoneyForm()}

        {/* Payment Button */}
        {selectedMethod && (
          <TouchableOpacity
            style={[styles.payButton, loading && styles.payButtonDisabled]}
            onPress={handlePayment}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.payButtonText}>
                Pay {user?.preferred_currency || 'RWF'} {grandTotal.toLocaleString()}
              </Text>
            )}
          </TouchableOpacity>
        )}

        {/* Security Info */}
        <View style={styles.securityContainer}>
          <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
          <Text style={styles.securityText}>
            Secured by Flutterwave. Your payment information is encrypted.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  amountContainer: {
    backgroundColor: '#1995AD',
    padding: 30,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
  },
  amountLabel: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  amountValue: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  methodContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 15,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  methodCardSelected: {
    borderColor: '#1995AD',
    backgroundColor: '#F0F9FC',
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodName: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 15,
    color: '#000',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#DDD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#1995AD',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1995AD',
  },
  formContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#000',
  },
  row: {
    flexDirection: 'row',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#1976D2',
  },
  payButton: {
    backgroundColor: '#1995AD',
    marginHorizontal: 20,
    marginTop: 30,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  securityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  securityText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#666',
  },
});

export default PaymentScreen;