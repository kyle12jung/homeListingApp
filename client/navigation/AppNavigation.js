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


const HomeStackNavigator = () => {

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
						component={HomeStackNavigator}
					/>
					<Tab.Screen 
						name='Post'
						component={AddHomeScreen}
					/>
					<Tab.Screen 
						name='My Info'
						component={ProfileStackNavigator}
					/>
			</Tab.Navigator>
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
			<Stack.Screen 
				name="Home"
				component={HomeStackNavigator}
				options={{ headerShown: false }}
			/>
		</Stack.Navigator>
	)
}

function AppsNavigator() {

	const [isLoading, setIsLoading] = useState(false)
	const [signedIn, setSignedIn] = useState(false)

	const loadProfile = async () => {
		setIsLoading(true)
		const token = await AsyncStorage.getItem('token');
		if(!token) {
			setSignedIn(false)
			console.log('login failed')
		} else {
			setSignedIn(true)
			console.log('login successful')
		}
		setIsLoading(false)
	}
	

	useEffect(() => {
		loadProfile();	
		console.log('login triggered')
	}, []);

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
				{!signedIn ? (
					<Stack.Screen 
						name='Authenticate'
						component={LoginStackNavigator}
					/>
				):(
					<></>
				)}
				<Stack.Screen 
					name='App'
					component={LoggedInNavigator}
				/>
				{signedIn ? (
					<Stack.Screen 
						name='Authenticate'
						component={LoginStackNavigator}
					/>
				):(
					<></>
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