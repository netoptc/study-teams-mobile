import { Container, Form, HeaderList, NumberOfPlayers } from "./styles";

import { useEffect, useState, useRef } from "react";
import { Alert, FlatList, TextInput } from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";

import { AppError } from "@utils/AppError";

import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { playersGetByGroupAndTeam } from "@storage/player/playersGetByGroupAndTeam";

import { ButtonIcon } from "@components/ButtonIcon";
import { Filter } from "@components/Filter";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { Input } from "@components/Input";
import { PlayerCard } from "@components/PlayerCard";
import { Button } from "@components/Button";
import { ListEmpty } from "@components/ListEmpty";
import { PlayerStorageDTO } from "@storage/player/PlayerStorageDTO";
import { playerRemoveByBroup } from "@storage/player/playerRemoveByGroup";
import { groupRemoveByName } from "@storage/group/groupRemoveByName";
import { Loading } from "@components/Loading";


type RouteParamas = {
    group: string;
}

export function Players(){

    const [team, setTeam] = useState('Time A')
    const [ newPlayerName, setNewPlayerName ] = useState('') 
    const [players, setPlayers] = useState<PlayerStorageDTO[]>([])
    const [ isLoading, setIsLoading ] = useState(false);

    const navigation = useNavigation();
    const route = useRoute();
    const { group } = route.params as RouteParamas

    const newPlayerNameInputRef = useRef<TextInput>(null);


    async function handleAddPlayer(){
        if (newPlayerName.trim().length === 0) {
            return Alert.alert('Nova pessoa', 'Informe o nome da pessoa para adicionar.')
        } 

        const newPlayer = {
            name: newPlayerName,
            team,
        }

        try {
            await playerAddByGroup(newPlayer, group);
            
            newPlayerNameInputRef.current?.blur();

            fetchPlayersByTeam();
            setNewPlayerName('');
        } catch (error) {
            if (error instanceof AppError) {
                Alert.alert('Nova pessoa', error.message)
            } else {
                console.log(error)
                Alert.alert('Nova pessoa', 'Não foi possivel adicionar')
            }
        }
    }

    async function fetchPlayersByTeam() {
        try {
            setIsLoading(true);
            const playersByTeam = await playersGetByGroupAndTeam(group, team)
            setPlayers(playersByTeam)
        } catch (error) {
            console.log(error); 
            Alert.alert('Pessoas', 'Não foi possivel buscar as pessoas do time selecionado');
        } finally {
            setIsLoading(false);
        }
    }

    async function handlePlayerRemove(playerName: string) {
        try {
            await playerRemoveByBroup(playerName, group);
            await fetchPlayersByTeam();
        } catch(error) {
            console.log(error)
            Alert.alert('Remover pessoa',   'Não foi possivel remover essa pessoa.')
        }
    }

    async function groupRemove() {
        try {
            groupRemoveByName(group);
            navigation.navigate("groups");
        } catch (error) {
            console.log(error);
            Alert.alert('Remover grupo', 'Não foi possivel remover essa turma.')
        }
    }

    function handleRemoveGroup() {
        Alert.alert(
            'Remover',
            'Deseja removero grupo?',
            [
                { text: 'Não', style: 'cancel' },
                { text: 'Sim', onPress: () => groupRemove() }
            ]
        )
    }

    useEffect(()=>{
        fetchPlayersByTeam();
    },[team])

    return(
        <Container>
            <Header showBackButton />

            <Highlight 
                title={group}
                subtitle="adcione a galera e separe os times"
            />
            <Form>
            <Input
                inputRef={newPlayerNameInputRef}
                placeholder="Nome da pessoa"
                autoCorrect={false}
                onChangeText={setNewPlayerName}
                value={newPlayerName}
                onSubmitEditing={handleAddPlayer}
                returnKeyType="done"
            />
            <ButtonIcon 
                icon="add"
                onPress={handleAddPlayer}
            />
            </Form>

            <HeaderList>
                <FlatList 
                    data={['Time A', 'Time B']}
                    keyExtractor= {item => item}
                    renderItem= {({item}) => 
                        <Filter
                            title={item}
                            isActive={item === team}
                            onPress={() => setTeam(item)}
                        />
                    }
                    horizontal    
                />
                <NumberOfPlayers>
                    {players.length}
                </NumberOfPlayers>
            </HeaderList>
            {
                isLoading ? <Loading/> :
                <FlatList 
                    data={players}
                    keyExtractor= {item => item.name}
                    renderItem= {({item}) => 
                        <PlayerCard 
                            name={item.name}
                            onRemove={()=> { handlePlayerRemove(item.name) }}
                        />
                    }
                    ListEmptyComponent={() => (
                        <ListEmpty message='Que tal cadastrar a primeira turma?' />
                    )}
                    contentContainerStyle={[
                        {paddingBottom: 100},
                        players.length === 0 && { flex: 1 }
                    ]}
                    showsVerticalScrollIndicator={false}
                />
            }
            <Button 
                title="Remover turna"
                type="SECONDARY"
                onPress={handleRemoveGroup}
            />
        </Container>
    )
}