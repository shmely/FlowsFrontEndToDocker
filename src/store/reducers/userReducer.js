//import { UPDATE_USER, QUERY_USERS, SET_USER, USER_REMOVE, ADD_USER, LOAD_USER } from '../actions/userActions';
let localLoggedinUser = null;
const GUEST_USER = {
    "_id": "5eccd4e1cb39d7f54947fd7e",
    "fullName": "Guest",
    "email": "noemail@no.com",
    "img": "https://img.icons8.com/plasticine/2x/user.png"
}

if (sessionStorage.user) localLoggedinUser = JSON.parse(sessionStorage.user);
else localLoggedinUser = GUEST_USER;

const initialState = {
    users: [],
    user: localLoggedinUser
}

export function userReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_USER': {
            const logedInUser = (!action.user) ? localLoggedinUser : action.user
            return { ...state, user: logedInUser };
        }
        case 'USER_REMOVE':
            return {
                ...state,
                users: state.users.filter(user => user._id !== action.userId)
            };
        case 'SET_USERS':
            return { ...state, users: action.users };


        case 'ADD_USER':
            return {
                ...state,
                users: [...state.users, action.user]
            };
        case 'QUERY_USERS': {
            return {
                ...state,
                users: action.users
            }
        }
        default:
            return state;
    };

}


