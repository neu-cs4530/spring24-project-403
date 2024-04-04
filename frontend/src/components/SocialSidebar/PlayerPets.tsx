import React from 'react';
import { ListItem, OrderedList, Text, UnorderedList } from '@chakra-ui/react';
import PlayerController from '../../classes/PlayerController';
import { Pet } from '../../types/CoveyTownSocket';

type PlayerPetsProps = {
  player: PlayerController;
};

export default function PlayerPets({ player }: PlayerPetsProps): JSX.Element {
  if (player.playerPets.length === 0) {
    return (
      <UnorderedList spacing={3}>
        <ListItem>No pets</ListItem>
      </UnorderedList>
    );
  }

  return (
    <UnorderedList spacing={3}>
      {player.playerPets.map(pet => (
        <ListItem key={pet.id}>
          {pet.petType} (ID: {pet.id})
        </ListItem>
      ))}
    </UnorderedList>
  );
}
