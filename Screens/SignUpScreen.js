// SignupScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Adjust path if necessary

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        navigation.navigate('Home');
      })
      .catch(error => setError(error.message));
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.heading}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={styles.buttonContainer}>
          <View style={styles.buttonWrapper}>
            <Button title="Back to Sign In" onPress={() => navigation.goBack()} />
          </View>
          <View style={styles.buttonWrapper}>
            <Button title="Sign Up" onPress={handleSignup} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center the content vertically
    padding: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    width: '100%', // Ensure content takes full width for better centering
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Dark color for better readability
    marginBottom: 24, // Space between heading and input fields
    textAlign: 'center', // Center align heading
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: '100%', // Make inputs full width of the container
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', // Ensure buttons take full width for spacing
    marginTop: 16,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 4, // Adjust spacing between buttons if needed
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
});

export default SignupScreen;
