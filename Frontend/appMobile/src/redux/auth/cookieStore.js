import { AsyncStorage } from 'react-native';

    export const loadState = () => {
        try {
        const serializedState = AsyncStorage.getItem('state');
        console.log(serializedState)
        console.log("HARDCODE");
        const hardcodedState = JSON.parse(serializedState)
        console.log("HARDCODE: " + hardcodedState)
        if (serializedState === null) {
            console.log("NULL")
            return undefined;
        }else{
            console.log("Entra")
            console.log(JSON.parse(serializedState))
            return {loginData: JSON.parse(serializedState)};
        }  
        } catch (error) {
        return undefined;
        }
    };
  
    export const saveState = (state) => {
        try {
        const serializedState = JSON.stringify(state);
        AsyncStorage.setItem('state', serializedState);
        } catch (error) {
        }
    };