import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Button, FlatList, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const jwtDecode = require('jwt-decode');
import { useDispatch, useSelector } from 'react-redux';

import Card from '../components/Card';
import * as houseAction from '../redux/actions/houseAction';

const ProfileScreen = props => {

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [userID, setUserID] = useState('');

    const dispatch = useDispatch();

    const loadProfile = async () => {
        const token = await AsyncStorage.getItem('token');
        if(!token) {
            props.navigation.navigate('Authenticate', { screen: 'Login' });
        }

        const decoded = jwtDecode(token);
        setFullName(decoded.fullName);
        setEmail(decoded.email);
        setUserID(decoded._id)
    }

    const logout = props => {
        AsyncStorage.removeItem('token')
            .then(() => {
                props.navigation.replace('Authenticate', { screen: 'Login' })
            })
            .catch(err => console.log(err));
    }
    
    useEffect(() => {
        loadProfile();
        dispatch(houseAction.fetchHouses())
        .then(() => console.log(houses))
        .catch((err) => console.log(err));
    }, [dispatch]);
    

    const houses = useSelector(state => state.house.houses.filter(house => house.user == userID))
    if(houses.length === 0) {
        return (
            <View style={styles.centered}>
                <Text style={styles.noHomeText}>You have no posts yet. Post one!</Text>
            </View>
        )
    }

    return(
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.sectionText}>Your Info</Text>
            </View>
            <View style={styles.infoContainer}>
                <View>
                    <Text style={styles.text}>Name: {fullName ? fullName: ''}</Text>
                </View>
                <View>
                    <Text style={styles.text}>Email: {email ? email : ''}</Text>
                </View>
            </View>
            <View>
                <Button 
                    title="Logout"
                    onPress={() => logout(props)}
                    color='#E5B8F4'
                />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.sectionText}>Your Posts</Text>
            </View>
            <View style={styles.postContainer}>
                <FlatList 
                    data={houses}
                    keyExtractor={item => item._id}
                    renderItem={({item}) => (
                    <Card 
                        navigation={props.navigation}
                        title={item.title}
                        address={item.address}
                        description={item.description}
                        price={item.price}
                        images={item.images}
                        bedroom={item.bedroom}
                        bathroom={item.bathroom}
                        id={item._id}
                        userID={item.user}
                        userName={item.userName}
                    />
                    )}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#2D033B',
    },
    infoContainer: {
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    textContainer: {
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    sectionText: {
        fontSize: 22,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    text: {
        fontSize: 15,
        color: '#ffffff'
    },
    postContainer: {
        height: 600,
        width: '100%',
        paddingBottom: 200,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2D033B'
    },
    noHomeText: {
        color: '#ffffff'
    }
})

export default ProfileScreen;