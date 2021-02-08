import { Text, ActivityIndicator, View, Image, FlatList, StyleSheet, RefreshControl} from 'react-native';
import React, { useState, useEffect } from "react";

export default function indexPage() {
  const [loading, setLoading] = useState(true)
  const [internArray, setInternArray] = useState([])

  useEffect(() => {
    fetch("http://192.168.0.106/PERIODE%2011/stage/show-yourself-backend/api/getInterns.php")
    .then((response) => response.json())
      .then((json) => setInternArray(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  function isOdd(num) { 
    evenOrUneven = num % 2;
    if (evenOrUneven = 0) {
      return 0;
    } else {
      return 1;
    }
  }



  return (
    <View>
      <Image source={require("./assets/logo.png")} />
      {loading ? <ActivityIndicator/> : (
        <FlatList
          data={internArray}
          keyExtractor={({ id }, index) => id}
          renderItem={({ item }) => (
          console.log(isOdd(item.id)),
          <Text style={[styles.text, (isOdd(item.id) == 0) ? styles.itemEven : styles.itemUneven]}>{item.name}, {item.category}</Text>
          )}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  itemEven: {
    backgroundColor: '#154273',
    color: '#FFF',
    padding: 20,
  },
  itemUneven: {
    flex: 1,
    backgroundColor: '#FFF',
    color: '#000000',
    padding: 20,
  },
  text: {
    fontSize: 20,
  },
});