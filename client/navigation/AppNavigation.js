import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialIcons } from '@expo/vector-icons'

import ProfileScreen from '../screens/ProfileScreen'
import AddHomeScreen from '../screens/AddHomeScreen'
import HomeDetailsScreen from '../screens/HomeDetailsScreen'
import HomeListScreen from '../screens/HomeListScreen'

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


const StackNavigator = () => {
  return (
    <Stack.Navigator>
        <Stack.Screen 
            name='HomeList'
            component={HomeListScreen}
            options={{title: 'HomeHunt'}}
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

function ProfileStackNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name='Profile'
                component={ProfileScreen}
            />
        </Stack.Navigator>
    )
}

function AppsNavigator() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({route}) => ({
                    tabBarIcon: () => {
                        let iconName
                        if (route.name=='Home') iconName = 'home'
                        else if (route.name=='About') iconName = 'info'
                        return <MaterialIcons name={iconName} size={24} />
                    }
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
        </NavigationContainer>
    )
}

export default AppsNavigator