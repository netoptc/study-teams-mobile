import AsyncStorage from "@react-native-async-storage/async-storage";
import { groupsGetAll } from "./groupsGetAll";
import { GROUP_COLLECTION, PLAYER_COLLECTION } from "@storage/strogeConfig";

export async function groupRemoveByName(groupDeleted: string) {
  try {
    const storage = await groupsGetAll();
  
    const filteredGroups =storage.filter(group => group !== groupDeleted);
    const groups = JSON.stringify(filteredGroups);
  
    await AsyncStorage.setItem(GROUP_COLLECTION, groups)
    await AsyncStorage.removeItem(`${PLAYER_COLLECTION}-${groupDeleted}`)
  } catch (error) {
    throw error;
  }
}