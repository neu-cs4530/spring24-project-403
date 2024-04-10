import {
  Button,
  Flex,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import React from 'react';
import { useInteractable, useInteractableAreaController } from '../../../classes/TownController';
import PetAdoptionCenterController from '../../../classes/interactable/PetAdoptionCenterController';
import useTownController from '../../../hooks/useTownController';
import { InteractableID, Pet } from '../../../types/CoveyTownSocket';
import PetAdoptionCenter from './PetAdoptionCenter';
import PetTransferScreen from './PetTransferScreen';
import ActivePetSelectionScreen from './PetActiveScreen';

function PetAdoptionArea({ interactableID }: { interactableID: InteractableID }): JSX.Element {
  const adoptionCenterController =
    useInteractableAreaController<PetAdoptionCenterController>(interactableID);
  const coveyTownController = useTownController();
  const adoptionCenter = adoptionCenterController?.toInteractableAreaModel();
  const [pets, setPets] = useState<Pet[]>([]);
  const [adoptedPetsCount, setAdoptedPetsCount] = useState<number>(
    adoptionCenterController.playerPetCount,
  );
  const maxPetsAllowed = 5;

  useEffect(() => {
    if (adoptionCenter) {
      coveyTownController.pause();
      if (!pets || pets.length === 0) {
        setPets(adoptionCenterController.pets);
      }
    } else {
      coveyTownController.unPause();
    }
  }, [coveyTownController, adoptionCenter, adoptionCenterController.pets, pets]);

  useEffect(() => {
    const handleUpdate = (petAdoptionCenter: PetAdoptionCenterController) => {
      setPets(petAdoptionCenter.pets);
      setAdoptedPetsCount(petAdoptionCenter.playerPetCount);
    };

    adoptionCenterController.addListener('update', handleUpdate);
    return () => {
      adoptionCenterController.removeListener('update', handleUpdate);
    };
  }, [adoptionCenterController, adoptionCenterController.pets, pets]);

  const toast = useToast();

  function handleAdoption(adoptedPet: Pet) {
    if (adoptedPetsCount >= maxPetsAllowed) {
      toast({
        title: `Limit Reached`,
        description: `You can only adopt up to ${maxPetsAllowed} pets.`,
        status: 'warning',
      });
      return;
    }

    try {
      const pet = adoptionCenterController.adoptPet(adoptedPet);
      if (!pet) {
        throw new Error('Error adopting pet.');
      }
      setAdoptedPetsCount(adoptedPetsCount + 1);
      toast({
        title: `Success`,
        description: `You have adopted ${pet.id}!`,
        status: 'info',
      });
    } catch (error) {
      console.log(error);
      toast({
        title: `Error`,
        description: (error as Error).toString(),
        status: 'error',
      });
    }
  }

  function adoptPet(pet: Pet) {
    handleAdoption(pet);
    // replace the now adopted pet
    setPets(adoptionCenterController.pets);
  }

  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const petDisplayName = (pet: Pet): string => {
    return pet.id.length > 20 ? pet.id.substring(0, 20) + '...' : pet.id;
  };

  const petImage = (pet: Pet): string => {
    return `./assets/pets/${pet.petType.toLowerCase()}-${pet.color}.png`;
  };

  return (
    <VStack spacing={4} align='stretch' p={4}>
      <Heading size='md'>Adoptable Pets</Heading>
      {pets &&
        pets.map((pet, index) => (
          <Flex
            key={index}
            align='center'
            border='1px'
            borderColor={borderColor}
            p={4}
            borderRadius='md'>
            <Image src={petImage(pet)} alt='Pet' boxSize='50px' mr={4} />
            <VStack align='stretch'>
              <Text>Type: {pet.petType}</Text>
              <Text>ID: {petDisplayName(pet)}</Text>
              <Text>Color: {pet.color}</Text>
            </VStack>
            <Button ml='auto' colorScheme='teal' size='sm' onClick={() => adoptPet(pet)}>
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
            <PetTransferScreen />
            <ActivePetSelectionScreen />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
  return <></>;
}
