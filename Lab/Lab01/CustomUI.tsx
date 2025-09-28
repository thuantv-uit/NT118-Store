import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const CustomUI = () => {
  const { width, height } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      <View style={styles.container1}>
        <View style={[styles.box2, { width: width / 2, height: height * 2 / 6 }]} />
        <View style={[styles.box3, { width: width / 2, height: height * 2 / 6 }]} />
      </View>
      <View style={[styles.box1, { width: width / 2, height: height * 2 / 3 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flexDirection: 'row'
  },
  container1: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flexDirection: 'column'
  },
  box1: {
    backgroundColor: 'red',
  },
  box2: {
    backgroundColor: 'green'
  },
  box3: {
    backgroundColor: 'blue'
  }
});

export default CustomUI;