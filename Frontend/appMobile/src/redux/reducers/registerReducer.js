const initState = {
    userData : {}
}

const registerReducer = (state = initState, action) => {
    switch(action){
        case 'REGISTER_USER': 
            console.log(" account reducer triggered with the data: " + action.userData);
        break;
        case 'REGISTER_USER_ERROR':
                console.log(" error: " + action.error);
        break;
        default: return state;
    }
    return state;
}

export default registerReducer;