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
import React, { useCallback, useEffect, useState } from 'react';
import BasePet from '../../../classes/BasePet';
import { useInteractable, useInteractableAreaController } from '../../../classes/TownController';
import PetAdoptionCenterController from '../../../classes/interactable/PetAdoptionCenterController';
import useTownController from '../../../hooks/useTownController';
import { InteractableID, PetAdoptionCenter } from '../../../types/CoveyTownSocket';

function PetAdoptionArea({ interactableID }: { interactableID: InteractableID }): JSX.Element {
  const adoptionCenterController =
    useInteractableAreaController<PetAdoptionCenterController>(interactableID);
  const coveyTownController = useTownController();
  const adoptionCenter = adoptionCenterController?.toInteractableAreaModel();
  const [pets, setPets] = useState<BasePet[]>([]);

  useEffect(() => {
    if (adoptionCenter) {
      coveyTownController.pause();
      setPets(adoptionCenterController?.pets);
    } else {
      coveyTownController.unPause();
    }
  }, [coveyTownController, adoptionCenter]);

  const toast = useToast();

  const adoptPet = useCallback(async () => {
    toast({
      title: 'Pet adopted!',
      description: "You've successfully adopted a pet.",
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  }, [toast]);

  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const petDisplayName = (pet: BasePet): string => {
    return pet.name || (pet.id.length > 20 ? pet.id.substring(0, 20) + '...' : pet.id);
  };

  const petImage = (pet: BasePet): string => {
    return `./assets/pets/${pet.constructor.name.toLowerCase()}.png`;
  };

  return (
    <VStack spacing={4} align='stretch' p={4}>
      <Heading size='md'>Adoptable Pets:</Heading>
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
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
  return <></>;
}
