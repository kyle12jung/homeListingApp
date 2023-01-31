import React from 'react';
import {StyleSheet, View, Text, ImageBackground, TouchableOpacity, FlatList, Image} from 'react-native';
import Slider from './Slider';


const Card = props => {
    return (
        <TouchableOpacity
            onPress={() => props.navigation.navigate('HomeDetails', {
              houseId: props.id}
              )}
        >
            <View style={styles.card}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{props.title.length > 20 ? props.title.slide(0,20)+'...' : props.title}</Text>
                    <Text style={styles.userName}>{props.userName}</Text>
                </View>
                <View style={styles.imageContainer}>
                  <Slider data={props.images} style={styles.image}/>
                </View>
                <View style={styles.imageTextOverlay}>
                  <View style={styles.priceContainer}>
                      <Text style={styles.price}>${props.price}</Text>
                  </View>
                  <View style={styles.roomInfoContainer}>
                      <Text style={styles.roomInfo}>{props.bedroom} bedroom(s), {props.bathroom} bathroom(s)</Text>
                  </View>
                </View>
                <View style={styles.description}>
                    <Text style={styles.descriptionText}>{props.description.length > 30 ? props.description.slice(0, 30)+'...' : props.description}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        // shadowColor: 'black',
        // shadowOpacity: 0.25,
        // shadowOffset: { width: 0, height: 2},
        // shadowRadius: 8,
        backgroundColor: '#2D033B',
        elevation: 5,
        height: 500,
        borderStyle: 'solid',
        borderColor: 'black',
        borderBottomWidth: 2
      },
      userNameContainer: {
        padding: 10,
      },
      userName: {
        textAlign: 'right',
        color: '#ffffff'
      },
      titleContainer: {
        height: '10%',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff'
      },
      imageContainer: {
        width: 400,
        height: 400,
        overflow: 'hidden',
        position: 'relative'
      },
      image: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
      },
      imageTextOverlay: {
        position: 'absolute',
        top: 395,
      },
      priceContainer: {
        backgroundColor: '#810CA8',
        height: 30,
        width: 80,
      },
      price: {
        fontSize: 20,
        color: '#fff',
        textAlign: 'center'
      },
      roomInfoContainer: {
        backgroundColor: '#810CA8',
        height: 25,
        width: 220,
      },
      roomInfo: {
        fontSize: 15,
        color: '#fff',
        textAlign: 'center'
      },
      description: {
        margin: 10
      },
      descriptionText: {
        fontSize: 16,
        color: '#ffffff'
      }
});

export default Card;