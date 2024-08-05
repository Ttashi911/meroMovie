import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Adjust path if necessary

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignup = () => {
    setError(''); // Clear previous errors

    // Validate email
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Validate password
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // Confirm password
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Create user
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        Alert.alert(
          'Sign Up Successful',
          'Your account has been created successfully.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Optionally, navigate to another screen or take other actions
                navigation.goBack();
              },
            },
          ]
        );
      })
      .catch(error => {
        // Handle errors such as email already in use
        switch (error.code) {
          case 'auth/email-already-in-use':
            setError('This email address is already registered.');
            break;
          case 'auth/invalid-email':
            setError('The email address is not valid.');
            break;
          case 'auth/weak-password':
            setError('The password is too weak. It should be at least 6 characters long.');
            break;
          default:
            setError('Sign Up Error: ' + error.message);
            break;
        }
      });
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
          autoCapitalize="none" // Disable automatic capitalization
          keyboardType="email-address" // Optional: Set the keyboard to email type
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none" // Ensure no capitalization
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none" // Ensure no capitalization
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.signupButton]} onPress={handleSignup}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.signInButton]} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Back to Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5', // Light background color for better contrast
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderRadius: 5,
    width: '100%',
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
  },
  button: {
    backgroundColor: '#E35335',
    borderRadius: 5,
    paddingVertical: 12,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  signInButton: {
    marginRight: 5,
  },
  signupButton: {
    marginLeft: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 16,
    fontSize: 14,
  },
});

export default SignupScreen;
