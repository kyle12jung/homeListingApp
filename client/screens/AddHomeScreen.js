import { View, Text, StyleSheet, ScrollView, TextInput, Button, Alert, ActivityIndicator, Image, FlatList } from 'react-native'
import React, { useState } from 'react'
import { Formik } from 'formik'
import * as yup from 'yup'
import * as houseAction from '../redux/actions/houseAction'
import {useDispatch} from 'react-redux'
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const formSchema = yup.object({
    title: yup.string().required().min(3).max(20),
    price: yup.number().required(),
    bedroom: yup.number().required(),
    bathroom: yup.number().required(),
    address: yup.string().required(),
    description: yup.string().required(),
    images: yup.string().required(),
})

const AddHomeScreen = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [imageURLs, setImageURLs] = useState([])

    const convertToValidURL = (fileSystemURL) => {
          FileSystem.getInfoAsync(fileSystemURL)
            .then(({ uri }) => {
                setImageURLs(prevImageURLs => [...prevImageURLs, uri]);          
                console.log(imageURLs)
            })
            .catch(err => console.log(err))
            
    };
    

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
                images: '',
                bedroom: '',
                bathroom: '',
                price: '',
                address: '',
                description: ''
            }}
            validationSchema={formSchema}
            onSubmit={(values) => {
                if (imageURLs.length > 0) {
                    setIsLoading(true)
                    const imagesConverted = JSON.stringify(imageURLs.join(','))
                    values.images = imagesConverted;
                    console.log(values)
                    dispatch(houseAction.createHome(values))
                        .then(() => {
                            setIsLoading(false)
                            Alert.alert('Created Successfully')
                        })
                        .catch(() => {
                            setIsLoading(false)
                            setImageURLs([])
                            Alert.alert('An error occurred. Try Again.', [{text: 'OK'}])
                        })
                } else {
                    Alert.alert('Please add at least one image')
                }
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
                        <Text style={styles.label}>Add images (Up to 5)</Text>
                        <Button
                            title='Press to Add'
                            color='#E5B8F4'
                            onPress={async () => {
                                let result = await ImagePicker.launchImageLibraryAsync({
                                    mediaTypes: ImagePicker.MediaTypeOptions.All,
                                    allowsEditing: true,
                                    aspect: [1, 1],
                                    quality: 1,
                                });
                            
                                if (!result.canceled) {
                                    const filepath = result.assets[0].uri;
                                    try {
                                        convertToValidURL(filepath);
                                    } catch (error) {
                                        console.error(error);
                                        Alert.alert('An error occurred. Try Again.', [{text: 'OK'}])
                                    }
                                } else {
                                    setImageURLs([])
                                    Alert.alert('An error occurred. Try Again. Added Images will be deleted. You will have to readd the images.', [{text: 'OK'}])
                                }
                                
                                
                            }}
                            
                        />
                        
                        {
                            imageURLs.length == 0 ? <Image source={require('../assets/images/default-image.jpg')} style={{ width: 331, height: 331}}/> : 
                            <View style={styles.carousel}>
                                <FlatList
                                    data={imageURLs}
                                    horizontal={true}
                                    renderItem={({ item }) => {
                                        return (
                                            <View style={styles.itemContainer}>
                                                <Image source={{uri: item}} style={{ width: 331, height: 331}}/>
                                            </View>
                                        )
                                    }}
                                    keyExtractor={item => item}
                                    pagingEnabled={true}
                                    showsHorizontalScrollIndicator={false}
                                />
                            </View>
                        }
                        <Text style={styles.error}>{props.touched.images && props.errors.images}</Text>
                    </View>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Number of Bedroom(s)</Text>
                        <TextInput 
                            style={styles.input}
                            onChangeText={props.handleChange('bedroom')}
                            onBlur={props.handleBlur('bedroom')}
                            value={props.values.bedroom}
                        />
                        <Text style={styles.error}>{props.touched.homeType && props.errors.homeType}</Text>
                    </View>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Number of Bathroom(s)</Text>
                        <TextInput 
                            style={styles.input}
                            onChangeText={props.handleChange('bathroom')}
                            onBlur={props.handleBlur('bathroom')}
                            value={props.values.bathroom}
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
    },
    carousel: {
        width: 331,
        height: 331
    },
    itemContainer: {
        width: 331,
        height: 331,
        alignItems: "center",
        justifyContent: "center"
    },
    // caroselItem: {
    //     width: '100%',
    //     height: 400
    // },
})

export default AddHomeScreen