import { useState }from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

// JSX
export default function App() {
  
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
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
