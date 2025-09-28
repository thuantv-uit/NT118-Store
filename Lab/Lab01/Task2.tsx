import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const Task2 = () => {
  const { width, height } = Dimensions.get('window');

  return (
    // Red and others color
    <View style={styles.container}>
        {/* Blue and others color */}
      <View style={styles.container1}>
        {/* Violet and others color */}
        <View style={styles.container2}>
            {/* Violet */}
            <View style={[styles.box4, { width: width / 8, height: height * 2 / 6 }]}/>
            <View style={styles.container1}>
                {/* Yellow */}
                <View style={[styles.box5, { width: width * 3 / 8, height: height * 1 / 6 }]}/>
                {/* Green */}
                <View style={[styles.box2, { width: width * 3 / 8, height: height * 1 / 6 }]}/>
            </View>
        </View>
        {/* Blue */}
        <View style={[styles.box3, { width: width / 2, height: height * 2 / 6 }]} />
      </View>
      {/* Red */}
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
  container2: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flexDirection: 'row-reverse'
  },
  box1: {
    backgroundColor: 'red',
  },
  box2: {
    backgroundColor: 'green'
  },
  box3: {
    backgroundColor: 'blue'
  },
  box4: {
    backgroundColor: 'violet'
  },
  box5: {
    backgroundColor: 'yellow'
  }
});

export default Task2;