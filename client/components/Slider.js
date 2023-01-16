import React from 'react';
import { Image, FlatList, View, StyleSheet } from 'react-native';


const Slider = ({data}) => {
    // console.log(data)
    return (
        <FlatList
            data={data}
            horizontal={true}
            renderItem={({ item }) => {
                console.log(item)
                return (
                    <View style={styles.itemContainer}>
                        <Image source={{uri: item}} style={styles.item}/>
                    </View>
                )
            }}
            keyExtractor={item => item}
            pagingEnabled={true} // this will make the scrolling snap to the edges of the child elements
            showsHorizontalScrollIndicator={false} // this will hide the horizontal scrollbar
        />
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        width: 400,
        height: 400,
        alignItems: "center",
        justifyContent: "center"
    },
    item: {
        width: 400,
        height: "100%",
    },
});


export default Slider
