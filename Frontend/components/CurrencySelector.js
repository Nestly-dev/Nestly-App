// Frontend/components/CurrencySelector.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const CURRENCY_INFO = {
  RWF: { name: 'Rwandan Franc', symbol: 'FRw', flag: '🇷🇼' },
  USD: { name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  EUR: { name: 'Euro', symbol: '€', flag: '🇪🇺' },
  GBP: { name: 'British Pound', symbol: '£', flag: '🇬🇧' }
};

export const CurrencySelector = ({ visible, onClose }) => {
  const { selectedCurrency, changeCurrency, availableCurrencies } = useCurrency();
  const { theme } = useTheme();

  const handleSelect = (currency) => {
    changeCurrency(currency);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
              <Text style={[styles.title, { color: theme.colors.text }]}>
                Select Currency
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <MaterialIcons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            {/* Currency List */}
            <ScrollView style={styles.listContainer}>
              {availableCurrencies.map((currency) => {
                const info = CURRENCY_INFO[currency];
                const isSelected = selectedCurrency === currency;

                return (
                  <TouchableOpacity
                    key={currency}
                    style={[
                      styles.currencyItem,
                      { borderBottomColor: theme.colors.border },
                      isSelected && {
                        backgroundColor: theme.colors.primaryLight + '20'
                      }
                    ]}
                    onPress={() => handleSelect(currency)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.currencyLeft}>
                      <Text style={styles.flag}>{info.flag}</Text>
                      <View style={styles.currencyInfo}>
                        <Text style={[styles.currencyCode, { color: theme.colors.text }]}>
                          {currency}
                        </Text>
                        <Text style={[styles.currencyName, { color: theme.colors.textSecondary }]}>
                          {info.name}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.currencyRight}>
                      <Text style={[styles.currencySymbol, { color: theme.colors.textSecondary }]}>
                        {info.symbol}
                      </Text>
                      {isSelected && (
                        <MaterialIcons
                          name="check-circle"
                          size={24}
                          color={theme.colors.primary}
                          style={styles.checkIcon}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Info Text */}
            <View style={[styles.footer, { backgroundColor: theme.colors.backgroundSecondary }]}>
              <MaterialIcons name="info-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
                Prices will be converted automatically using current exchange rates
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  listContainer: {
    flex: 1,
  },
  currencyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
  },
  currencyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 32,
    marginRight: 12,
  },
  currencyInfo: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  currencyName: {
    fontSize: 14,
  },
  currencyRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '500',
    marginRight: 8,
  },
  checkIcon: {
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
  },
});

export default CurrencySelector;
