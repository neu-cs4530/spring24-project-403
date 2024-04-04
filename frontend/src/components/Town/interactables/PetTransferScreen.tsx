import {
  Box,
  Button,
  Heading,
  ListItem,
  OrderedList,
  Select,
  Stack,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { usePlayers } from '../../../classes/TownController';
import useTownController from '../../../hooks/useTownController';
import { Pet } from '../../../types/CoveyTownSocket';
import PlayerName from '../../SocialSidebar/PlayerName';
import PlayerPets from '../../SocialSidebar/PlayerPets';

export default function PetTransferScreen(): JSX.Element {
  const players = usePlayers();
  const { ourPlayer } = useTownController();
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
    const selectedPlayer = players.find(player => player.id === playerID);
    const petToTransfer = ourPlayer.pets?.find(pet => pet.id === petToTransferID);
    if (selectedPlayer && petToTransfer) {
      selectedPlayer.addPet(petToTransfer);
      ourPlayer.removePet(petToTransferID);
      toast({
        title: 'Pet transferred successfully.',
        description: `Pet ${petToTransfer.id} has been transferred to ${selectedPlayer.userName}.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Pet transfer failed.',
        description: 'Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }

  return (
    <Box p={5} shadow='md' borderWidth='1px' borderRadius='lg' overflow='hidden'>
      <Heading as='h3' size='md' mb={4}>
        Pet Transfers
      </Heading>
      <Select
        placeholder='Select the pet you want to transfer'
        onChange={event => setPetToTransferID(event.target.value)}
        mb={4}
        variant='filled'>
        {myPets.map(pet => (
          <option key={pet.id} value={pet.id}>
            {pet.petType} (ID: {pet.id})
          </option>
        ))}
      </Select>
      {petToTransferID && ( // Conditional rendering based on petToTransferID
        <OrderedList spacing={3}>
          {transferTo.map(player => (
            <>
              <ListItem key={player.id} d='flex' alignItems='center' justifyContent='space-between'>
                <Stack direction='row' align='center'>
                  <VStack align='start'>
                    <Text fontWeight='bold'>
                      <PlayerName player={player} />
                    </Text>
                    <Text>
                      <PlayerPets player={player} />
                    </Text>
                  </VStack>
                </Stack>
                <Button
                  colorScheme='teal'
                  variant='outline'
                  disabled={player.id === ourPlayer.id}
                  onClick={() => {
                    handleTransfer(player.id);
                  }}>
                  Transfer to {player.userName}
                </Button>
              </ListItem>
              <hr />
            </>
          ))}
        </OrderedList>
      )}
    </Box>
  );
}
