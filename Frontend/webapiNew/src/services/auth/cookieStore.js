


export const loadState = () => {
    try {
      const serializedState = localStorage.getItem('state');
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
      localStorage.setItem('state', serializedState);
      console.log('Cookies Saved!!', state);
    } catch (error) {
      console.log("Error saving cookies", error);
    }
  };