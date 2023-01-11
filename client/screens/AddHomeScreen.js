import { View, Text, StyleSheet, ScrollView, TextInput, Button, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { Formik } from 'formik'
import * as yup from 'yup'
import * as houseAction from '../redux/actions/houseAction'
import {useDispatch} from 'react-redux'

const formSchema = yup.object({
    title: yup.string().required().min(3).max(50),
    price: yup.number().required(),
    yearBuilt: yup.number().required(),
    image: yup.string().required(),
    address: yup.string().required(),
    description: yup.string().required(),
    homeType: yup.string().required(),
})

const AddHomeScreen = () => {

    const [isLoading, setIsLoading] = useState(false)

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size={"large"}/>
            </View>
        )
    }

    const dispatch = useDispatch()

  return (
    <ScrollView style={styles.container}>
        <Formik
            initialValues={{
                title: '',
                image: '',
                homeType: '',
                price: '',
                yearBuilt:'',
                address: '',
                description: ''
            }}
            validationSchema={formSchema}
            onSubmit={(values) => {
                setIsLoading(true)
                dispatch(houseAction.createHome(values))
                    .then(() => {
                        setIsLoading(false)
                        Alert.alert('Created Successfully')
                    })
                    .catch(() => {
                        setIsLoading(false)
                        Alert.alert('An error occurred. Try Again.', [{text: 'OK'}])
                    })
            }}
        >
            {
                (props) => (
                    <View style={styles.form}>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Title</Text>
                        <TextInput 
                            style={styles.input}
                            onChangeText={props.handleChange('title')}
                            onBlur={props.handleBlur('title')}
                            value={props.values.title}
                        />
                        <Text style={styles.error}>{props.touched.title && props.errors.title}</Text>
                    </View>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Image URL</Text>
                        <TextInput 
                            style={styles.input}
                            onChangeText={props.handleChange('image')}
                            onBlur={props.handleBlur('image')}
                            value={props.values.image}
                        />
                        <Text style={styles.error}>{props.touched.image && props.errors.image}</Text>
                    </View>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Home Type</Text>
                        <TextInput 
                            style={styles.input}
                            onChangeText={props.handleChange('homeType')}
                            onBlur={props.handleBlur('homeType')}
                            value={props.values.homeType}
                        />
                        <Text style={styles.error}>{props.touched.homeType && props.errors.homeType}</Text>
                    </View>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Price</Text>
                        <TextInput 
                            style={styles.input}
                            onChangeText={props.handleChange('price')}
                            onBlur={props.handleBlur('price')}
                            value={props.values.price}
                        />
                        <Text style={styles.error}>{props.touched.price && props.errors.price}</Text>
                    </View>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Year Built</Text>
                        <TextInput 
                            style={styles.input}
                            onChangeText={props.handleChange('yearBuilt')}
                            onBlur={props.handleBlur('yearBuilt')}
                            value={props.values.yearBuilt}
                        />
                        <Text style={styles.error}>{props.touched.yearBuilt && props.errors.yearBuilt}</Text>
                    </View>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Address</Text>
                        <TextInput 
                            style={styles.input}
                            multiline
                            onChangeText={props.handleChange('address')}
                            onBlur={props.handleBlur('address')}
                            value={props.values.address}
                        />
                        <Text style={styles.error}>{props.touched.address && props.errors.address}</Text>
                    </View>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Description</Text>
                        <TextInput 
                            style={styles.input}
                            multiline
                            onChangeText={props.handleChange('description')}
                            onBlur={props.handleBlur('description')}
                            value={props.values.description}
                        />
                        <Text style={styles.error}>{props.touched.description && props.errors.description}</Text>
                    </View>
                    
                    <View style={styles.buttonContainer}>
                        <Button color='#C147E9' title="Add Home"onPress={props.handleSubmit} />
                    </View>
                </View>
                )
            }
        </Formik>


    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#2D033B'
    },
    form: {
        margin: 20,
        backgroundColor: '#810CA8',
        padding: 20,
        borderRadius: 10,
    },
    formGroup: {
        width: '100%',
    },
    label: {
        marginVertical: 10,
        color: '#ffffff'
    },
    input: {
        paddingHorizontal: 2,
        paddingVertical: 8,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    buttonContainer: {
        marginTop: 10,
    },
    error: {
        color: 'red',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default AddHomeScreen