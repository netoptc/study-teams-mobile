import { FlatList } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';

import { Button } from '@components/Button';
import { GroupCard } from '@components/GroupCard';
import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import { ListEmpty } from '@components/ListEmpty';

import { Container } from './styles';
import { groupsGetAll } from '@storage/group/groupsGetAll';
import { Loading } from '@components/Loading';

export function Groups() {
  const [ groups, setGourps ] = useState<string[]>([]) 
  const [ isLoading, setIsLoading ] = useState(false);

  
  const navigation = useNavigation()

  function handleNewGroup() {
    navigation.navigate('new');
  }

  function handleOpenGroup(group: string) {
    navigation.navigate('players', { group });
  }

  async function fetchGroups() {
    try {
      setIsLoading(true)
      const data = await groupsGetAll();
      setGourps(data)
    } catch(error) {
      console.log(error)
    }  finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(useCallback(() => {
    fetchGroups();
  }, []));

  return (
    <Container>
      <Header/>
      <Highlight 
        title='Turmas'
        subtitle='jogue com a sua turma'
      />
      {
        isLoading ? <Loading /> :
        <FlatList
          data={groups}
          keyExtractor= { item => item }
          renderItem={({item}) => (
            <GroupCard
              title={item}
              onPress = {() => {handleOpenGroup(item)}}
            />
          )}
          contentContainerStyle={groups.length === 0 && {flex: 1}}
          ListEmptyComponent={() => (
            <ListEmpty message='Que tal cadastrar a primeira turma?' />
          )}
          showsVerticalScrollIndicator={false}
        />
      }
      <Button 
        title='Criar nova turma'
        onPress={handleNewGroup}
      />
    </Container>
  );
}
