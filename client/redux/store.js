import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import HouseReducer from './reducers/HouseReducer';
import authReducer from './reducers/authReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    house: HouseReducer
});

const middleware = composeWithDevTools(applyMiddleware(thunk));

export default createStore(rootReducer, middleware);