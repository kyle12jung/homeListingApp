import React from 'react';
import {StyleSheet, View, Text, ScrollView, Image} from 'react-native';
import { useSelector } from 'react-redux';

import Slider from '../components/Slider';

const HomeDetailsScreen = (props) => {

  const {houseId} = props.route.params;

  const house = useSelector(state => state.house.houses.find(house => house._id == houseId))
  console.log(house.images)
    return (
        <ScrollView style={styles.background}>
            <View style={styles.container}>
                <View style={styles.heading}>
                    <Text style={styles.title}>{house.title}</Text>
                </View>
                <View style={styles.carousel}>
                    <Slider data={house.images}/>
                </View>
                <View style={styles.group}>
                    <Text style={styles.label}>Price: </Text>
                    <Text style={styles.value}>${house.price}</Text>
                </View>
                <View style={styles.group}>
                    <Text style={styles.label}>Address: </Text>
                    <Text style={styles.value}>{house.address}</Text>
                </View>
                <View style={styles.group}>
                  <Text style={styles.label}>Home Info: </Text>
                  <Text style={styles.value}>{house.bedroom} bedroom(s), {house.bathroom} bathroom(s)</Text>
                </View>
                <View style={styles.group}>
                    <Text style={styles.label}>Description: </Text>
                    <Text style={styles.value}>{house.description}</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#2D033B'
  },
  container: {
    flex: 1,
    marginVertical: 10,
  },
  heading: {
    marginHorizontal: 20,
    marginBottom: 10
  },
  title: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: 'bold',
  },
  carousel: {
    width: 405,
    height: 400
  },
  image: {
    width: 400,
    height: 400
  },
  group: {
    marginHorizontal: 20,
    marginVertical: 10,
    flexDirection: 'row'
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#ffffff"
  },
  value: {
    fontSize: 18,
    flexShrink: 1,
    color: "#ffffff"
  }
});

export default HomeDetailsScreen;