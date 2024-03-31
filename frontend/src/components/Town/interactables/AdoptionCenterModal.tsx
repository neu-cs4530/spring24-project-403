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
import React, { useCallback, useEffect, useState } from 'react';
import BasePet from '../../../classes/BasePet';
import { useInteractable, useInteractableAreaController } from '../../../classes/TownController';
import PetAdoptionCenterController from '../../../classes/interactable/PetAdoptionCenterController';
import useTownController from '../../../hooks/useTownController';
import { InteractableID } from '../../../types/CoveyTownSocket';
import PetAdoptionCenter from './PetAdoptionCenter';

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
    return pet.name || (pet.id.length > 5 ? pet.id.substring(0, 5) + '...' : pet.id);
  };

  return (
    <Grid templateColumns={'repeat(2, 1fr)'} gap={6} p={4}>
      <VStack spacing={4} align='stretch'>
        <Heading size='md'>Adoptable Pets:</Heading>
        {pets.map((pet, index) => (
          <Flex
            key={index}
            align='center'
            border='1px'
            borderColor={borderColor}
            p={4}
            borderRadius='md'>
            <Image src={'https://placehold.co/100'} alt='Pet' boxSize='50px' mr={4} />
            <Text>{petDisplayName(pet)}</Text>
            <Button ml='auto' colorScheme='teal' size='sm' onClick={adoptPet}>
              Adopt
            </Button>
          </Flex>
        ))}
      </VStack>
      <Box p={4} border='1px' borderColor={borderColor} borderRadius='md'>
        <Heading size='md' mb={4}>
          Adopt PLACEHOLDER today!
        </Heading>
        <Image src={'https://placehold.co/200'} alt='Pet Placeholder' mb={4} />
        <Text mb={4}>PET DESCRIPTION PLACEHOLDER.</Text>
        <Button colorScheme='teal' onClick={adoptPet}>
          Adopt
        </Button>
      </Box>
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
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
  return <></>;
}
