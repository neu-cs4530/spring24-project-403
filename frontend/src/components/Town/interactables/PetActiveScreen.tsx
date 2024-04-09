import { Box, Button, Heading, Select, Text, VStack, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import useTownController from '../../../hooks/useTownController';
import { Pet } from '../../../types/CoveyTownSocket';

export default function ActivePetSelectionScreen(): JSX.Element {
  const { ourPlayer } = useTownController();
  const townController = useTownController();
  const [activePetID, setActivePetID] = useState<string>('');
  const [myPets, setMyPets] = useState<Pet[]>([]);
  const toast = useToast();
  const [activePet, setActivePet] = useState<Pet | undefined>(ourPlayer.pets && ourPlayer.pets[0]);

  useEffect(() => {
    setMyPets(ourPlayer.pets || []);
    setActivePet(ourPlayer.pets && ourPlayer.pets[0]);
  }, [ourPlayer.pets]);

  useEffect(() => {
    const handleUpdate = (pets: Pet[]) => {
      setMyPets(pets);
    };

    ourPlayer.addListener('petsUpdated', handleUpdate);
    return () => {
      ourPlayer.removeListener('petsUpdated', handleUpdate);
    };
  }, [ourPlayer]);

  const handleSetActivePet = (petID: string) => {
    const pet = myPets.find(p => p.id === petID);
    if (!pet) {
      toast({
        title: 'Error',
        description: 'Pet not found.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    // TO-DO: Update backend to reflect change in activePet (PlayerController or TownController maybe)
    // Need something like... ourPlayer.setActivePet(pet);
    townController.setActivePet(pet);

    toast({
      title: 'Active Pet Updated',
      description: `Your active pet has been updated successfully.`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Box p={5} borderRadius='lg' overflow='hidden'>
      <Heading as='h3' size='md' mb={4}>
        Select Active Pet
      </Heading>
      <Select
        placeholder='Select your active pet'
        onChange={event => setActivePetID(event.target.value)}
        mb={4}
        value={activePetID}
        variant='filled'>
        {myPets.map(pet => (
          <option key={pet.id} value={pet.id}>
            {pet.petType} (ID: {pet.id})
          </option>
        ))}
      </Select>
      <VStack>
        {activePet && (
          <Text mt={2}>
            {/* TODO: Need to make it so it shows the activePet as it is changed */}
            Current Active Pet: {activePet.color} {activePet.petType.toLowerCase()} (ID:{' '}
            {activePet.id})
          </Text>
        )}
        <Button
          colorScheme='teal'
          variant='solid'
          onClick={() => handleSetActivePet(activePetID)}
          isDisabled={!activePetID}>
          Set as Active Pet
        </Button>
      </VStack>
    </Box>
  );
}
