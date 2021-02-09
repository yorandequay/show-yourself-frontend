import { Text, ActivityIndicator, View, Image, FlatList, StyleSheet, RefreshControl, TextInput} from 'react-native';
import React, { useState, useEffect } from "react";
import filter from 'lodash.filter';

export default function indexPage() {
  const API_ENDPOINT = `http://192.168.0.106/PERIODE%2011/stage/show-yourself-backend/api/getInterns.php`;
  const [loading, setLoading] = useState(true);
  const [internArray, setInternArray] = useState([]);
  const [fullInternArray, setFullInternArray] = useState([]);
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = React.useState(false);

  renderHeader = () => 
  (
    <View
      style={styles.border}
    >
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="always"
        value={query}
        onChangeText={queryText => handleSearch(queryText)}
        placeholder="Search"
      />
    </View>
  )

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
      'http://192.168.0.106/PERIODE%2011/stage/show-yourself-backend/api/getInterns.php',
    );
    let responseJson = await response.json();
    setInternArray(responseJson);
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

  const handleSearch = text => {
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
            {item.id} {"\n"}
            {item.name}, {item.category}{"\n"}
            {item.begin_internship} till {item.end_internship}{"\n"}
            Groep: {item.groupID}
            </Text>
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
    fontSize: 20,
  },
  itemUneven: {
    flex: 1,
    backgroundColor: '#FFF',
    color: '#000000',
    padding: 20,
    fontSize: 20,
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