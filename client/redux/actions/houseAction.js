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

export const createHome = ({ title, price, address, description, bedroom, bathroom, images }) => {

    try {

        return async dispatch => {
            const response = await fetch('http://192.168.50.114:3000/api/houses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    price,
                    address,
                    description,
                    bedroom,
                    bathroom,
                    images
                })
            })

            const responseData = await response.json();
            console.log(responseData)
            dispatch({
                type: CREATE_HOUSES,
                payload: responseData
            })
        }
    } catch (err) {
        console.log(err)
    }

}