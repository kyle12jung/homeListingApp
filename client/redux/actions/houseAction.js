export const FETCH_HOUSES = 'FETCH_HOUSES';
export const CREATE_HOUSES = 'CREATE_HOUSES';

export const fetchHouses = () => {
    return async dispatch => {

        // logic to fetch houses from API
        const result = await fetch('http://192.168.50.114:3000/api/houses');

        const resultData = await result.json();

        dispatch({
            type: FETCH_HOUSES,
            payload: resultData
        });
    }
}

export const createHome = ({ title, price, address, description, bedroom, bathroom, images, user, userName }) => {


    try {
        // console.log('images: ')
        // console.log(images)
        return async dispatch => {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('price', price);
            formData.append('address', address);
            formData.append('description', description);
            formData.append('bedroom', bedroom);
            formData.append('bathroom', bathroom);
            formData.append('user', user);
            formData.append('userName', userName);
            images.forEach((image, i) => {
                formData.append('images', {
                    uri: image, // this is the path to your file. see Expo ImagePicker or React Native ImagePicker
                    type: 'image/jpg', // example: image/jpg
                    name: `image${i}.jpg` // example: upload.jpg
                });
            })

            const response = await fetch('http://192.168.50.114:3000/api/houses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData
            })
            const data = await response.json();
            console.log(data);
            dispatch({
                type: CREATE_HOUSES,
                payload: data
            })
        }
    } catch (err) {
        console.log(err)
    }

}


// export const createHome = ({ title, price, address, description, bedroom, bathroom, images }) => {

//     try {

//         return async dispatch => {
//             const response = await fetch('http://192.168.50.114:3000/api/houses', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     title,
//                     price,
//                     address,
//                     description,
//                     bedroom,
//                     bathroom,
//                     images
//                 })
//             })

//             const responseData = await response.json();
//             console.log(responseData)
//             dispatch({
//                 type: CREATE_HOUSES,
//                 payload: responseData
//             })
//         }
//     } catch (err) {
//         console.log(err)
//     }

// }