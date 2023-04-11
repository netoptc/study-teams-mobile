import AsyncStorage from "@react-native-async-storage/async-storage";
import { PLAYER_COLLECTION } from "@storage/strogeConfig";
import { playersGetByGroup } from "./playersGetByGroup";



export async function playerRemoveByBroup(playerName: string, group: string) {
  try {
    const storage = await playersGetByGroup(group);

    const filteredPlayers = storage.filter(player => player.name != playerName);
    const players = JSON.stringify(filteredPlayers);

    await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, players)
  } catch (error) {
    throw error;
  }
}