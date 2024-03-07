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
  
  export default function NewPetModal(): JSX.Element {
    const coveyTownController = useTownController();
    const newConversation = useInteractable('conversationArea');
    const [topic, setTopic] = useState<string>('');

    const placeHolderPetsList = ['dog', 'cat', 'rabbit']
  
    const isOpen = newConversation !== undefined;
  
    useEffect(() => {
      if (newConversation) {
        coveyTownController.pause();
      } else {
        coveyTownController.unPause();
      }
    }, [coveyTownController, newConversation]);
  
    const closeModal = useCallback(() => {
      if (newConversation) {
        coveyTownController.interactEnd(newConversation);
      }
    }, [coveyTownController, newConversation]);
  
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
                  {placeHolderPetsList.map((pet, index) => (
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
  