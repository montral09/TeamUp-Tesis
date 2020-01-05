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
            console.log(" account reducer triggered with the data: "+action.userData);
        break;
        case REGISTER_USER_ERROR:
                console.log(" error: "+action.error);
        break;
        default: return state;
    }
    return state;
}

export default accountReducer;