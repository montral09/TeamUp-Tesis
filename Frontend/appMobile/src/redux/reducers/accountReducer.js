import { loadState, saveState } from '../auth/cookieStore';

const initState = {
    login_status : 'NOT_LOGGED_IN',
    userData : {},
    tokenObj : {},
    messageObj: {},
    systemLanguage: 'es'
}

const loginReducer = (state = initState, action) => {
    let newStateObj = {...state}
    switch(action.type){
        case 'LOG_IN':
            console.log("This is the token obj:");
            console.log(action.tokenObj)
            newStateObj = {
                ...state,
                login_status: 'LOGGED_IN',
                userData: action.userData,
                tokenObj: action.tokenObj,
            }
            saveState(newStateObj);
            break;
        case 'LOG_IN_ERROR' :
            newStateObj = {
                login_status: 'NOT_LOGGED_IN',
                ...state,
            }
        break;
        case 'LOG_OUT':
            newStateObj = {
                ...state,
                login_status: 'NOT_LOGGED_IN',
                userData: [],
            }
            saveState(newStateObj);
            break;
        case 'MODIFY_DATA':
            newStateObj = {
                ...state,
                userData: action.userData
            }
            saveState(newStateObj);
        break;
        case 'TOKEN_UPDATED' : 
            newStateObj = {
                ...state,
                tokenObj: action.tokenObj
            }
            saveState(newStateObj);
        break;
        case 'LANGUAGE_UPDATED' : 
            newStateObj = {
                ...state,
                systemLanguage: action.systemLanguage
            }
            saveState(newStateObj);
        break;
    }    
    console.log("newStateObj: ");console.log(newStateObj);
    return newStateObj
}

export default loginReducer