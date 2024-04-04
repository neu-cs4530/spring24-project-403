import {
  Box,
  Button,
  Flex,
  Grid,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
  VStack,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import React from 'react';
import { useInteractable, useInteractableAreaController } from '../../../classes/TownController';
import PetAdoptionCenterController from '../../../classes/interactable/PetAdoptionCenterController';
import useTownController from '../../../hooks/useTownController';
<<<<<<< HEAD
<<<<<<< HEAD
import { InteractableID, Pet } from '../../../types/CoveyTownSocket';
import PetAdoptionCenter from './PetAdoptionCenter';
import PetTransferScreen from './PetTransferScreen';
=======
import { InteractableID } from '../../../types/CoveyTownSocket';
>>>>>>> 8ceb3e3 (UI updates and addition of individual animal images)
=======
import { InteractableID, PetAdoptionCenter } from '../../../types/CoveyTownSocket';
>>>>>>> a1fc546 (Popup design with images)

function PetAdoptionArea({ interactableID }: { interactableID: InteractableID }): JSX.Element {
  const adoptionCenterController =
    useInteractableAreaController<PetAdoptionCenterController>(interactableID);
  const coveyTownController = useTownController();
  const adoptionCenter = adoptionCenterController?.toInteractableAreaModel();
  const [pets, setPets] = useState<Pet[]>([]);
  const [activePet, setActivePet] = useState<Pet>(pets[0]);

  useEffect(() => {
    if (adoptionCenter) {
      coveyTownController.pause();
      if (pets.length === 0) {
        setPets(adoptionCenterController?.pets);
      }
    } else {
      coveyTownController.unPause();
    }
  }, [coveyTownController, adoptionCenter]);

  useEffect(() => {
    setActivePet(pets[0]);
  }, [pets]);

  const toast = useToast();

  function handleAdoption() {
    try {
      const pet = adoptionCenterController.adoptPet(activePet);
      if (!pet) {
        throw new Error('Error adopting pet.');
      }
      toast({
        title: `Success`,
        description: `You have adopted ${pet.id}!`,
        status: 'info',
      });
    } catch (error) {
      console.log(error);
      toast({
        title: `Error`,
        description: (error as Error).toString,
        status: 'error',
      });
    }
  }

<<<<<<< HEAD
  function adoptPet() {
    handleAdoption();
    // replace the now adopted pet
    setPets(adoptionCenterController.replenish());
  }

  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const petDisplayName = (pet: Pet): string => {
    return pet.id.length > 20 ? pet.id.substring(0, 20) + '...' : pet.id;
  };

  const petImage = (pet: Pet): string => {
    return `./assets/pets/${pet.constructor.name.toLowerCase()}.png`;
  };

  return (
    <Grid templateColumns={'repeat(2, 1fr)'} autoColumns={'auto'} autoFlow={'row'} gap={2}>
      <GridItem height={'100%'}>
        <h1>Adoptable Pets:</h1>
        <Flex direction='column' align='center' justify='center'>
          {pets.map((pet, index) => (
            <Box key={index}>
              <img src={'https://placehold.co/20'} alt='Placeholder' />
              <Button onClick={() => setActivePet(pet)}>{pet.id}</Button>
            </Box>
          ))}
        </Flex>
      </GridItem>
      <GridItem height={'100%'}>
        <h1>Adopt a {activePet && activePet.petType} today!</h1>
        <img src={'https://placehold.co/400'} alt='Dog Placeholder' />
        <Text fontSize='xl'> Pet id: {activePet && activePet.id}</Text>
        <Button onClick={adoptPet}>Adopt</Button>
      </GridItem>
    </Grid>
=======
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const petDisplayName = (pet: BasePet): string => {
    return pet.name || (pet.id.length > 20 ? pet.id.substring(0, 20) + '...' : pet.id);
  };

  const petImage = (pet: BasePet): string => {
    return `./assets/pets/${pet.constructor.name.toLowerCase()}.png`;
  };

  return (
    <VStack spacing={4} align='stretch' p={4}>
      <Heading size='md'>Adoptable Pets</Heading>
      {pets.map((pet, index) => (
        <Flex
          key={index}
          align='center'
          border='1px'
          borderColor={borderColor}
          p={4}
          borderRadius='md'>
          <Image src={petImage(pet)} alt='Pet' boxSize='50px' mr={4} />
          <VStack align='stretch'>
            <Text>Type: {pet.constructor.name}</Text>
            <Text>ID: {petDisplayName(pet)}</Text>
          </VStack>
          <Button ml='auto' colorScheme='teal' size='sm' onClick={adoptPet}>
            Adopt
          </Button>
        </Flex>
      ))}
    </VStack>
>>>>>>> 8ceb3e3 (UI updates and addition of individual animal images)
  );
}

/**
 * A wrapper component for the PetAdoptionCenter component.
 * Determines if the player is currently in the pet adoption center on the map, and if so,
 * renders the selected adoption center modal.
 *
 */
export default function PetAreaWrapper(): JSX.Element {
  const adoptionCenter = useInteractable<PetAdoptionCenter>('petAdoptionCenter');
  const townController = useTownController();
  const closeModal = useCallback(() => {
    if (adoptionCenter) {
      townController.interactEnd(adoptionCenter);
      townController.unPause();
    }
  }, [townController, adoptionCenter]);
  if (adoptionCenter) {
    return (
      <Modal
        isOpen={true}
        onClose={closeModal}
        closeOnOverlayClick={false}
        size='xl'
        scrollBehavior={'inside'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{adoptionCenter.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <PetAdoptionArea interactableID={adoptionCenter.id} />
            <PetTransferScreen />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
  return <></>;
}
