export const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS'
export const REGISTER_USER_FAIL = 'REGISTER_USER_FAIL'
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS'
export const LOGIN_USER_FAIL = 'LOGIN_USER_FAIL'

const schoolIP = '10.105.254.28';
const homeIP = '192.168.50.114:3000';

export const registerUser = (authData) => {
    const { fullName, email, password } = authData;

    return async dispatch => {

        // logic to make a post request to create the user
        const result = await fetch(`http://${schoolIP}:3000/api/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fullName,
                email,
                password
            })
        })

        const resultData = await result.json()

        if (resultData.success) {
            dispatch({
                type: REGISTER_USER_SUCCESS,
                payload: resultData
            })
        } else {
            dispatch({
                type: REGISTER_USER_FAIL
            })
        }

        return resultData
    }

}

export const loginUser = (authData) => {
    const { fullName, email, password } = authData;

    return async dispatch => {

        // logic to make a post request to login
        // logic to make a post request to create the user
        const result = await fetch(`http://${schoolIP}:3000/api/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        })

        const resultData = await result.json()
        console.log(resultData)

        if (resultData.success) {
            dispatch({
                type: LOGIN_USER_SUCCESS,
                payload: resultData
            })
        } else {
            dispatch({
                type: LOGIN_USER_FAIL
            })
        }

        return resultData
    }

}