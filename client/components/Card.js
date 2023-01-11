import React from 'react';
import {StyleSheet, View, Text, ImageBackground, TouchableOpacity} from 'react-native';

const Card = props => {
    return(
        <TouchableOpacity
            onPress={() => props.navigation.navigate('HomeDetails', {
              houseId: props.id}
              )}
        >
            <View style={styles.card}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{props.title.length > 30 ? props.title.slide(0,30)+'...' : props.title}</Text>
                </View>
                <View style={styles.imageContainer}>
                    <ImageBackground source={{uri: props.image}} style={styles.image}>
                        {/* <Text style={styles.price}>{props.price}</Text> */}
                        <View style={styles.priceContainer}>
                            <Text style={styles.price}>${props.price}</Text>
                        </View>
                    </ImageBackground>
                </View>
                <View style={styles.description}>
                    <Text style={styles.descriptionText}>{props.description.length > 100 ? props.description.slice(0, 100)+'...' : props.description}</Text>
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
        height: 300,
        borderStyle: 'solid',
        borderColor: 'black',
        borderBottomWidth: 2
      },
      titleContainer: {
        height: '15%',
        padding: 10
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff'
      },
      imageContainer: {
        width: '100%',
        height: '65%',
        overflow: 'hidden'
      },
      image: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
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
      description: {
        margin: 10
      },
      descriptionText: {
        fontSize: 16,
        color: '#ffffff'
      }
});

export default Card;