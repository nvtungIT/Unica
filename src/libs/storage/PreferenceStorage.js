import AsyncStorage from '@react-native-async-storage/async-storage';
// Get preference value with key
export const getPreference = async (key = '', defaultValue = null) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (e) {
    return defaultValue;
  }
};

// Save preference key - value
export const setPreference = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (error) {
    // Error saving data
    console.error(error);
    return false;
  }
};

//Remove preference key
export const removePreference = async key => {
  try {
    await AsyncStorage.removeItem(key);
    console.log('Remove Preferrent Key: ' + key);
    return true;
  } catch (err) {
    return false;
  }
};
