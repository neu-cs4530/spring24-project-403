import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import BasePet from '../../../classes/BasePet';
import { useInteractable, useInteractableAreaController } from '../../../classes/TownController';
import PetAdoptionCenterController from '../../../classes/interactable/PetAdoptionCenterController';
import useTownController from '../../../hooks/useTownController';
import { InteractableID } from '../../../types/CoveyTownSocket';
import PetAdoptionCenter from './PetAdoptionCenter';

function PetAdoptionArea({ interactableID }: { interactableID: InteractableID }): JSX.Element {
  const adoptionCenterController = useInteractableAreaController<PetAdoptionCenterController>(interactableID);
  const coveyTownController = useTownController();
  const adoptionCenter = adoptionCenterController?.toInteractableAreaModel();
  const [pets, setPets] = useState<BasePet[]>([]);
  // create useState for "activePet" which is the pet being actively shown in the modal (referenced by id)

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
    console.log('Adopting pet');
  }, []);

  return (
        <Grid templateColumns={'repeat(2, 1fr)'} autoColumns={'auto'} autoFlow={'row'} gap={2}>
          <GridItem height={'100%'}>
            <h1>Adoptable Pets:</h1>
            <Flex direction='column' align='center' justify='center'>
              {pets.map((pet, index) => (
                <Box key={index}>
                  <img src={'https://placehold.co/20'} alt='Placeholder' />
                  <Button>{pet.id}</Button>
                </Box>
              ))}
            </Flex>
          </GridItem>
          <GridItem height={'100%'}>
            <h1>Adopt PLACEHOLDER today!</h1>
            <img src={'https://placehold.co/400'} alt='Dog Placeholder' />
            <Text fontSize='xl'> PET DESCRIPTION PLACEHOLDER.</Text>
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
      <Modal isOpen={true} onClose={closeModal} closeOnOverlayClick={false} size='xl' scrollBehavior={'inside'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{adoptionCenter.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <PetAdoptionArea interactableID={adoptionCenter.id}/>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
  return <></>;
}