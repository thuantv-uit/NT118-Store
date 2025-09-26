import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';

const Task3 = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>

      {/* Header */}
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Lab01_2c</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>SIGN IN</Text>

      {/* Email + Text Input */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Username:</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      </View>

      {/* Password + Text Input */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Password:</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
      </View>

      {/* Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>SIGN IN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 50,
    width: '100%',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerText: {
    paddingLeft: 20,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 20,
    color: '#000',
  },
  formGroup: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    marginRight: 20,
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#808080',
    fontSize: 16,
    paddingHorizontal: 100,
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    // justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  button: {
    backgroundColor: '#D3D3D3',
    padding: 10,
    borderRadius: 5,
    width: 80,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default Task3;