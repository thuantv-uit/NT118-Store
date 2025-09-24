import { useState }from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

// JSX
export default function App() {

  const [students, setStudents] = useState([
    { id: 1, name: "Thuan1", age: 21 },
    { id: 2, name: "Thuan2", age: 22 },
    { id: 3, name: "Thuan3", age: 23 },
    { id: 4, name: "Thuan4", age: 24 },
    { id: 5, name: "Thuan5", age: 25 },
    { id: 6, name: "Thuan6", age: 26 },
    { id: 7, name: "Thuan7", age: 27 },
    { id: 8, name: "Thuan8", age: 28 },
    { id: 9, name: "Thuan9", age: 29 },
    { id: 10, name: "Thuan10", age: 30 },
  ])
  
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 30 }}>Hello World</Text>
      <ScrollView>
        {students.map(item => {
          return (
            <View key={item.id} style={{
              padding: 30,
              backgroundColor: "violet",
              marginBottom: 30
            }}>
              <Text>{item.name}</Text>
            </View>
          )
        })}
      </ScrollView>
    </View>
  );
}

// StyleSheet not CSS
const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  }
});
