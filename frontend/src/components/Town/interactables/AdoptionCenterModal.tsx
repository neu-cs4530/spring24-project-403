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
    Text
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useInteractable } from '../../../classes/TownController';
import { Omit_ConversationArea_type_ } from '../../../generated/client';
import useTownController from '../../../hooks/useTownController';
import dog from './dog.jpg';
import PetAdoptionCenter from './PetAdoptionCenter';

export default function NewPetModal(): JSX.Element {
    // will be replaced by react hook to fetch the pet adoption center controller
    //const gameAreaController = use<GenericGameAreaController>();
    const coveyTownController = useTownController();
    // this placeholder is necessary since no pet adoption centers have been created on the map/town yet
    const adoptionCenter = useInteractable('conversationArea');
    const adoptionCenterReal = useInteractable('petAdoptionCenter') as PetAdoptionCenter;
    
    // How to get controller for a given model for adoption center
    //const adoptionCenterController = adoptionCenter ? coveyTownController.getPetAdoptionCenterController(adoptionCenterReal) : undefined;

    // will be replaced with actual pets list which will be fetched from the model which is provided by the controller
    
    let pets = adoptionCenterReal?.getPets();
    //let pets = ['Dog', 'Cat', 'Rabbit', 'Bird', 'Fish'];
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

    const closeModal = useCallback(() => {
    if (adoptionCenter) {
        coveyTownController.interactEnd(adoptionCenter);
    }
    }, [coveyTownController, adoptionCenter]);

    const toast = useToast();

    const adoptPet = useCallback(async () => {
    console.log('Adopting pet');
    }, []);

    return (
    <Modal
        size='3xl'
        isOpen={isOpen}
        onClose={() => {
        closeModal();
        coveyTownController.unPause();
        }}>
        <ModalOverlay />
        <ModalContent>
        <ModalHeader>Adopt a Pet Today!</ModalHeader>
        <ModalBody>
        <ModalCloseButton />
            <Grid 
            templateColumns={'repeat(2, 1fr)'}
            autoColumns={'auto'}
            autoFlow={'row'}
            gap={2}>
                <GridItem
                height={'100%'}
                >
                <h1>Adoptable Pets:</h1>
                <Flex
                direction='column'
                align='center'
                justify='center'
                >
                {pets.map((pet, index) => (
                    <Box key={index}>
                    <img src={dog} alt="Placeholder"/>
                    <Text>{pet}</Text>
                    <Spacer />
                    </Box>
                ))}
                </Flex>
            </GridItem>
            <GridItem
                height={'100%'}
            >
                    <h1>Adopt PLACEHOLDER today!</h1>
                    <img src={dog} alt="Dog Placeholder"/>
                    <Text fontSize='xl'> PET DESCRIPTION PLACEHOLDER</Text>
                <Button  onClick={adoptPet}>Adopt</Button>
                </GridItem>
            </Grid>
            </ModalBody>
        </ModalContent>
    </Modal>
    );
}
