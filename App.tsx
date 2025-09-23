import { StyleSheet, Text, View } from 'react-native';

// JSX
export default function App() {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.header}>ThuanTV</Text>
        <Text style={styles.parent}>
          ThuanUIT 
            <Text style={styles.child}>
              Hello
            </Text> 
        </Text>
      </View>
      <Text style={styles.hello1}>Hello World 1 - ThuanTV</Text>
      <Text>Hello World 2 - ThuanTV</Text>
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
  },
  hello1 : { 
    color: "green", 
    fontSize: 30,
    borderColor: "red",
    borderWidth: 1,
    padding: 10
  },
  header : {
    fontSize: 20,
    fontWeight : "bold"
  },
  parent: {
    fontSize: 30,
    color: "green"
  },
  child: {
    fontSize: 25,
    color: "violet"
  }
});
