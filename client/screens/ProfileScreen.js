import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const jwtDecode = require('jwt-decode');

const ProfileScreen = props => {

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');

    const loadProfile = async () => {
        const token = await AsyncStorage.getItem('token');
        if(!token) {
            props.navigation.navigate('Authenticate', { screen: 'Login' });
        }

        const decoded = jwtDecode(token);
        setFullName(decoded.fullName);
        setEmail(decoded.email);
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
    });

    return(
        <View style={styles.container}>
            <View>
                <Text style={styles.text}>Name: {fullName ? fullName: ''}</Text>
            </View>
            <View>
                <Text style={styles.text}>Email: {email ? email : ''}</Text>
            </View>
            <View>
                <Button 
                    title="Logout"
                    onPress={() => logout(props)}
                    color='#E5B8F4'
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 40,
        backgroundColor: '#2D033B',
    },
    text: {
        fontSize: 22,
        color: '#ffffff'
    }
})

export default ProfileScreen;