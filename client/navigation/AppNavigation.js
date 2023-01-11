import { View, ActivityIndicator, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'

import ProfileScreen from '../screens/ProfileScreen'
import AddHomeScreen from '../screens/AddHomeScreen'
import HomeDetailsScreen from '../screens/HomeDetailsScreen'
import HomeListScreen from '../screens/HomeListScreen'
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


const StackNavigator = () => {

  return (
    <Stack.Navigator
			screenOptions={{
				headerShown: false
			}}
		>
        <Stack.Screen 
            name='HomeList'
            component={HomeListScreen}
        />
        <Stack.Screen 
            name='HomeDetails'
            component={HomeDetailsScreen}
        />
        <Stack.Screen 
            name='AddHome'
            component={AddHomeScreen}
        />
    </Stack.Navigator>
  )
}

const LoginStackNavigator = () => {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false
			}}
		>
			<Stack.Screen 
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
        />
        <Stack.Screen 
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
        />
		</Stack.Navigator>
	)
}

function ProfileStackNavigator() {
    return (
        <Stack.Navigator
					screenOptions={{
						headerShown: false
					}}
				>
            <Stack.Screen 
                name='Profile'
                component={ProfileScreen}
            />
        </Stack.Navigator>
    )
}

function LoggedInNavigator() {
    return (
			<Tab.Navigator
					screenOptions={({route}) => ({
							tabBarIcon: () => {
									let iconName
									if (route.name=='Home') iconName = 'home'
									else if (route.name=='My Info') iconName = 'info'
									return <MaterialIcons name={iconName} size={24} />
							},
							headerShown: false
					})}
			>
					<Tab.Screen 
							name='Home'
							component={StackNavigator}
					/>
					<Tab.Screen 
							name='My Info'
							component={ProfileStackNavigator}
					/>
			</Tab.Navigator>
    )
}

function AppsNavigator() {

	const [isLoading, setIsLoading] = useState(false)
	const [loaded, setLoaded] = useState(false)

	const loadProfile = async () => {
		const token = await AsyncStorage.getItem('token');
		if(!token) {
			setLoaded(false)
			console.log('login failed')
		} else {
			setLoaded(true)
			console.log('login successful')
		}
	}

	useEffect(() => {
		setIsLoading(true)
		loadProfile();
		setIsLoading(false)
		console.log('login triggered')
	}, [loaded]);

	if (isLoading) {
    return (
        <View style={styles.centered}>
            <ActivityIndicator size={"large"}/>
        </View>
    )
  }

	return (
		<NavigationContainer>
			<Stack.Navigator
				// screenOptions={{
				// 	headerShown: false
				// }}
			>
				{loaded ? (
					<Stack.Screen 
							name='App'
							component={LoggedInNavigator}
					/>
				):(
					<Stack.Screen 
							name='Authenticate'
							component={LoginStackNavigator}
					/>
				)}
			</Stack.Navigator>
		</NavigationContainer>
	)
}


const styles = StyleSheet.create({
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	}
})


export default AppsNavigator