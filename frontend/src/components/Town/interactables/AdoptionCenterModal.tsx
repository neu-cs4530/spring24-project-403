import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  useToast,
  Grid,
  GridItem,
  Text,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useInteractable } from '../../../classes/TownController';
import { Omit_ConversationArea_type_ } from '../../../generated/client';
import useTownController from '../../../hooks/useTownController';
import PetAdoptionCenter from './PetAdoptionCenter';

function PetAdoptionArea({ adoptionCenter }: { adoptionCenter: PetAdoptionCenter }): JSX.Element {
  // will be replaced by react hook to fetch the pet adoption center controller
  //const gameAreaController = use<GenericGameAreaController>();
  const coveyTownController = useTownController();

  // How to get controller for a given model for adoption center
  const adoptionCenterController = adoptionCenter ? coveyTownController.getPetAdoptionCenterController(adoptionCenter) : undefined;

  let pets = adoptionCenter?.getPets();
  if (!pets) {
    pets = [];
  }

  const isOpen = adoptionCenter !== undefined;

  useEffect(() => {
    if (adoptionCenter) {
      coveyTownController.pause();
    } else {
      coveyTownController.unPause();
    }
  }, [coveyTownController, adoptionCenter]);



  const toast = useToast();

  const adoptPet = useCallback(async () => {
    console.log('Adopting pet');
  }, []);

  return (
        <Grid templateColumns={'repeat(2, 1fr)'} autoColumns={'auto'} autoFlow={'row'} gap={2}>
          <GridItem height={'100%'}>
            <h1>Adoptable Pets:</h1>
            <Flex direction='column' align='center' justify='center'>
              {pets.map((pet, index) => (
                <Box key={index}>
                  <img src={'./frontend/public/logo192.png'} alt='Placeholder' />
                  <Text>{pet}</Text>
                  <Spacer />
                </Box>
              ))}
            </Flex>
          </GridItem>
          <GridItem height={'100%'}>
            <h1>Adopt PLACEHOLDER today!</h1>
            <img src={'./frontend/public/logo192.png'} alt='Dog Placeholder' />
            <Text fontSize='xl'> PET DESCRIPTION PLACEHOLDER</Text>
            <Button onClick={adoptPet}>Adopt</Button>
          </GridItem>
        </Grid>
  );
}

/**
 * A wrapper component for the PetAdoptionCenter component.
 * Determines if the player is currently in the pet adoption center on the map, and if so,
 * renders the selected game area component in a modal.
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
      <Modal isOpen={true} onClose={closeModal} closeOnOverlayClick={false} size='xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{adoptionCenter.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <PetAdoptionArea adoptionCenter={adoptionCenter}/>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
  return <></>;
}