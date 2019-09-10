export const logIn = (userData) =>{
    return {
         type: 'LOG_IN', 
         userData: userData
    }
}