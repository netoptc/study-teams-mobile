import AsyncStorage from "@react-native-async-storage/async-storage";
import { GROUP_COLLECTION } from "@storage/strogeConfig";
import { groupsGetAll } from "./groupsGetAll";
import { AppError } from "@utils/AppError";

export async function groupCreate(newgroup: string) {
    try {
        const storedGroups = await groupsGetAll();
        const groupAlreadyExist = storedGroups.includes(newgroup)
        if (groupAlreadyExist) {
            throw new AppError('Já existe um grupo cadastrado com esse nome.')
        }
        const storage =  JSON.stringify([...storedGroups, newgroup])
        await AsyncStorage.setItem(GROUP_COLLECTION, storage)
    } catch (error) {
        throw error;
    }
 }