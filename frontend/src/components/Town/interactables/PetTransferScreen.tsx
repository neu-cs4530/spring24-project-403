import { Box, Button, Heading, ListItem, OrderedList, Select } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { usePlayers } from '../../../classes/TownController';
import useTownController from '../../../hooks/useTownController';
import { Pet } from '../../../types/CoveyTownSocket';
import PlayerName from '../../SocialSidebar/PlayerName';

export default function PetTransferScreen(): JSX.Element {
  const players = usePlayers();
  const { ourPlayer } = useTownController();
  //const transferTo = players.filter(player => player.id !== ourPlayer.id).concat([]); WHILE IN DEVELOPMENT USE BELOW BECAUSE THERE"S ONLY ONE PLAYER
  const transferTo = players.concat([]);
  transferTo.sort((p1, p2) =>
    p1.userName.localeCompare(p2.userName, undefined, { numeric: true, sensitivity: 'base' }),
  );
  const [petToTransferID, setPetToTransferID] = React.useState<string>('');
  const [myPets, setMyPets] = React.useState<Pet[]>([]);

  useEffect(() => {
    if (!ourPlayer.pets) {
      return;
    }
    setMyPets(ourPlayer.pets);
  }, [ourPlayer.pets]);

  function handleTransfer(playerID: string) {
    //add pet to selected player
    const selectedPlayer = players.find(player => player.id === playerID);
    if (selectedPlayer) {
      selectedPlayer.addPet(ourPlayer.pets?.find(pet => pet.id === petToTransferID) as Pet);
    }
    //remove pet from current player
    ourPlayer.removePet(petToTransferID);
  }

  return (
    <Box>
      <Heading as='h2' fontSize={'l' as any}>
        {' '}
        Pet Transfer: Available Players{' '}
      </Heading>
      <Select
        placeholder='Select the pet you want to transfer'
        onChange={event => setPetToTransferID(event.target.value)}>
        {myPets &&
          myPets.map(pet => (
            <option key={pet.id} value={pet.id}>
              {pet.id}
            </option>
          ))}
      </Select>
      <OrderedList>
        {transferTo.map(player => (
          <ListItem key={player.id}>
            <PlayerName player={player} />
            <Button
              onClick={() => {
                handleTransfer(player.id);
              }}>
              Transfer Pet
            </Button>
          </ListItem>
        ))}
      </OrderedList>
    </Box>
  );
}
