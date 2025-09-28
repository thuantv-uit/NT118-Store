import React from 'react';
import { View, StyleSheet } from 'react-native';
import Task1 from './Task1';
import Task2 from './Task2';
import Task3 from './Task3';
import Task4 from './Task4';

const App = () => {
  return (
    <View style={styles.container}>
      {/* <Task1/> */}
      {/* <Task2/> */}
      {/* <Task3/> */}
      {/* <Task4/> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});

export default App;