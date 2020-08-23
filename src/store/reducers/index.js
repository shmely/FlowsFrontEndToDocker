import { combineReducers } from 'redux';
import { boardReducer } from './boardReducer'
import { userReducer } from './userReducer'


export const rootReducer = combineReducers({
    trelloApp: boardReducer,
    trelloUser: userReducer
})