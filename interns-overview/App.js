import { Text, ActivityIndicator, View, Image, FlatList, StyleSheet, RefreshControl, TextInput, TouchableWithoutFeedback, TouchableOpacity} from 'react-native';
import React, { useState, useEffect } from "react";
import filter from 'lodash.filter';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

export default function indexPage() {
  const API_ENDPOINT = `http://192.168.137.1/PERIODE%2011/stage/show-yourself-backend/api/getInterns.php`;
  const [loading, setLoading] = useState(true);
  const [internArray, setInternArray] = useState([]);
  const [fullInternArray, setFullInternArray] = useState([]);
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = React.useState(false);
  const Stack = createStackNavigator();

  renderHeader = () => (
    <View
      style={styles.border}
    >
      <TextInput
        value={query}
        onChangeText={text => handleSearch(text)}
        placeholder="Search"
      />
    </View>
  );

  useEffect(() => {
    fetch(API_ENDPOINT)
    .then((response) => response.json())
      .then((json) => setInternArray(json) & setFullInternArray(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const onRefresh = React.useCallback(async() => {
    setRefreshing(true);
    let response = await fetch(
      API_ENDPOINT,
    );
    let responseJson = await response.json();
    setFullInternArray(responseJson);
    console.log(responseJson);
    setRefreshing(false);
  }, []);

  function isOddNumber(num) { 
    this.evenOrUneven = num % 2;
    if (evenOrUneven == 0) {
      return 0;
    } else {
      return 1;
    }
  }

  const handleSearch = (text) => {
    const formattedQuery = text;
    const filteredData = filter(internArray, intern => {
      return contains(intern, formattedQuery);
    });
    setFullInternArray(filteredData);
    setQuery(text);
  };
  
  const contains = ({ name }, query) => {
    const fullName = name;
    if (fullName.includes(query)) {
      return true;
    }
    return false;
  };

  function internListComp() {
    return (
      <FlatList
      ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        contentContainerStyle={{ paddingBottom: 144 }}
        style={styles.flatList}
        data={fullInternArray}
        keyExtractor={({ id }, index) => id}
        renderItem={({ item }) => (
          <TouchableOpacity
          style={(isOddNumber(item.id) == 0) ? styles.itemUneven : styles.itemEven}>
            <Text style={(isOddNumber(item.id) == 0) ? styles.itemUnevenText : styles.itemEvenText}>
              {item.name}, {item.category}{"\n"}
              Groep: {item.groupID}
            </Text>
          </TouchableOpacity>
        )}
    />
    );
  };

  
  return (
    <View>
      <Image source={require("./assets/logo.png")} />
      {loading ? <ActivityIndicator/> : (
        <FlatList
        ListHeaderComponent={this.renderHeader}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          contentContainerStyle={{ paddingBottom: 144 }}
          style={styles.flatList}
          data={fullInternArray}
          keyExtractor={({ id }, index) => id}
          renderItem={({ item }) => (
          <Text style={(isOddNumber(item.id) == 0) ? styles.itemUneven : styles.itemEven}>
            {item.name}, {item.category}{"\n"}
            {item.begin_internship} till {item.end_internship}{"\n"}
            Groep: {item.groupID}
            </Text>
          )}
        />
      )}
    </View>
    
    // <NavigationContainer>
        
    //     <Stack.Navigator>
    //       <Stack.Screen
    //         name="Intern lijst"
    //         component={internListComp}
    //       />
    //     </Stack.Navigator>
    // </NavigationContainer>
  );
};
const styles = StyleSheet.create({
  itemEven: {
    backgroundColor: '#154273',
    padding: 10,
    fontSize: 20,
    color: '#FFF',
  },
  itemUneven: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 10,
    fontSize: 20,
    color: '#000000',
  },
  itemEvenText: {
    color: '#FFF',
  },
  itemUnevenText: {
    color: '#000000',
  },
  flatList: {
    flexGrow: 1,
  },
  border: {
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 20,
  }
});