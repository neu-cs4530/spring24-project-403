import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
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
import { InteractableID, Pet } from '../../../types/CoveyTownSocket';
import PetAdoptionCenter from './PetAdoptionCenter';
import PetTransferScreen from './PetTransferScreen';

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

  function adoptPet() {
    handleAdoption();
    // replace the now adopted pet
    setPets(adoptionCenterController.replenish());
  }

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
