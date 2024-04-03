import {
  Box,
  Button,
  Heading,
  ListItem,
  OrderedList,
  Select,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { usePlayers } from '../../../classes/TownController';
import useTownController from '../../../hooks/useTownController';
import { Pet } from '../../../types/CoveyTownSocket';
import PlayerName from '../../SocialSidebar/PlayerName';

export default function PetTransferScreen(): JSX.Element {
  const players = usePlayers();
  const { ourPlayer } = useTownController();
  //const transferTo = players.filter(player => player.id !== ourPlayer.id).concat([]); WHILE IN DEVELOPMENT USE BELOW BECAUSE THERE"S ONLY ONE PLAYER
  const transferTo = players
    .concat([])
    .sort((p1, p2) =>
      p1.userName.localeCompare(p2.userName, undefined, { numeric: true, sensitivity: 'base' }),
    );
  const [petToTransferID, setPetToTransferID] = useState<string>('');
  const [myPets, setMyPets] = useState<Pet[]>([]);
  const toast = useToast();

  useEffect(() => {
    setMyPets(ourPlayer.pets || []);
  }, [ourPlayer.pets]);

  function handleTransfer(playerID: string) {
    //add pet to selected player
    const selectedPlayer = players.find(player => player.id === playerID);
    const petToTransfer = ourPlayer.pets?.find(pet => pet.id === petToTransferID);
    if (selectedPlayer && petToTransfer) {
      selectedPlayer.addPet(petToTransfer);
      ourPlayer.removePet(petToTransferID);
      toast({
        title: 'Pet transferred successfully.',
        description: `Pet has been transferred to ${selectedPlayer.userName}.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }
  }

  return (
    <Box p={5} shadow='md' borderWidth='1px' borderRadius='lg' overflow='hidden'>
      <Heading as='h2' size='lg' mb={4}>
        Pet Transfer: Available Players
      </Heading>
      <Select
        placeholder='Select the pet you want to transfer'
        onChange={event => setPetToTransferID(event.target.value)}
        mb={4}
        variant='filled'>
        {myPets.map(pet => (
          <option key={pet.id} value={pet.id}>
            {pet.name} (ID: {pet.id})
          </option>
        ))}
      </Select>
      <OrderedList spacing={3}>
        {transferTo.map(player => (
          <ListItem key={player.id} d='flex' alignItems='center' justifyContent='space-between'>
            <Stack direction='row' align='center'>
              <Text fontWeight='bold'>
                <PlayerName player={player} />
              </Text>
            </Stack>
            <Button
              colorScheme='teal'
              variant='outline'
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
