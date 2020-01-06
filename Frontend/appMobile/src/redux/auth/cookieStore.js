import { AsyncStorage } from 'react-native';

    export const loadState = () => {
        try {
        const serializedState = AsyncStorage.getItem('state');
        if (serializedState === null) {
            return undefined;
        }
        console.log('Cookies Loaded!!', serializedState);
        return {loginData: JSON.parse(serializedState)};
        } catch (error) {
        console.log('No cookies available', error);
        return undefined;
        }
    };
  
    export const saveState = (state) => {
        try {
        const serializedState = JSON.stringify(state);
        AsyncStorage.setItem('state', serializedState);
        console.log('Cookies Saved!!', state);
        } catch (error) {
        console.log("Error saving cookies", error);
        }
    };