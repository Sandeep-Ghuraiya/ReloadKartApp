import AsyncStorage from '@react-native-async-storage/async-storage';

const clearAppDataOnFirstInstall = async () => {
  try {
    const alreadyLaunched = await AsyncStorage.getItem('alreadyLaunched');

    if (alreadyLaunched === null) {
      await AsyncStorage.clear();

      await AsyncStorage.setItem('alreadyLaunched', 'true');

      console.log('First Launch - Storage Cleared');
    }
  } catch (error) {
    console.log(error);
  }
};

export default clearAppDataOnFirstInstall;
