import {
    REGISTER_USER,
    MODIFY_USER,
    REGISTER_USER_ERROR
} 
from "./actionTypes";

const initState = {
    userData : {}
}

const accountReducer = (state = initState, action) => {
    switch(action){
        case REGISTER_USER: 
        break;
        case REGISTER_USER_ERROR:
        break;
        default: return state;
    }
    return state;
}

export default accountReducer;