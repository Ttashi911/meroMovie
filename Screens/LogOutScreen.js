// LogoutScreen.js
import React from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const LogOutScreen = ({ navigation }) => {
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigation.navigate('Auth');
      })
      .catch(error => console.error('Error signing out:', error));
  };

  return (
    <View style={styles.container}>
      <Text>Logout Screen</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LogOutScreen;
