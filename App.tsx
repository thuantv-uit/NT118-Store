import { useState }from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

// JSX
export default function App() {
  
  const [count, setCount] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<number>(0);

  return (
    <View style={styles.container}>
      <View>
        <Text style={{ fontSize: 20, fontWeight: "600" }}>Name: {name}</Text>
        <TextInput
          autoCapitalize='sentences'
          onChangeText={(value) => setName(value)}
          style={{
            borderColor: "red",
            borderWidth: 1,
            width: 200,
            padding: 15
          }}
        />
      </View>
      <View>
        <Text style={{ fontSize: 20, fontWeight: "600" }}>Age: {age}</Text>
        <TextInput
          onChangeText={(value) => setAge(+value)}
          style={{
            borderColor: "red",
            borderWidth: 1,
            width: 200,
            padding: 15
          }}
          keyboardType='numeric'
          maxLength={2}
        />
      </View>
      <View>
        <Text style={{ 
          fontSize: 30, 
          fontWeight: "600" 
        }}>
          count = {count}
        </Text>
      </View>
      <View>
        <Button 
          title='Increase'
          color={"green"} 
          onPress={() => setCount(count + 1)}
        />
      </View>
    </View>
  );
}

// StyleSheet not CSS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
