const initState = {
    userData : {}
}

const registerReducer = (state = initState, action) => {
    switch(action){
        case 'REGISTER_USER': 
        break;
        case 'REGISTER_USER_ERROR':
        break;
        default: return state;
    }
    return state;
}

export default registerReducer;