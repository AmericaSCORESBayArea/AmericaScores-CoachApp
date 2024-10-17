import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch (error) {
    console.error(`Error getting item with key "${key}":`, error);
    return null;
  }
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting item with key "${key}":`, error);
  }
}

export async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
    // console.log(`Item with key "${key}" removed successfully.`);
  } catch (error) {
    console.error(`Error removing item with key "${key}":`, error);
  }
}
