import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to ResearchCollab</Text>

      {/* Circular Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>🔑</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, fontWeight: 'bold' },
  loginButton: {
    position: 'absolute', top: 20, right: 20, width: 50, height: 50, borderRadius: 25,
    backgroundColor: '#007bff', justifyContent: 'center', alignItems: 'center',
  },
  loginText: { color: 'white', fontSize: 20 },
});

export default HomeScreen;
