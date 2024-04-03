import React, { useEffect, useState } from 'react';
import PlayerController from '../../classes/PlayerController';
import { Pet } from '../../types/CoveyTownSocket';

type PlayerPetsProps = {
  player: PlayerController;
};

export default function PlayerPets({ player }: PlayerPetsProps): JSX.Element {
  const [currentPlayersPets, setcurrentPlayersPets] = useState<Pet[] | []>(player.playerPets);

  useEffect(() => {
    setcurrentPlayersPets(player.playerPets);
  }, [player.playerPets]);

  return (
    <>
      <ol>
        {player.playerPets.length === 0 && <li>No pets</li>}
        {player.playerPets.map(pet => (
          <li key={pet.id}>
            {pet.petType} (ID: {pet.id})
          </li>
        ))}
      </ol>
    </>
  );
}
