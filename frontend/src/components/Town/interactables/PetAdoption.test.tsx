import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PetTransferScreen from './PetTransferScreen';
import { ChakraProvider } from '@chakra-ui/react';

// Mocks
jest.mock('../../../hooks/useTownController', () => ({
  useTownController: () => ({
    ourPlayer: {
      id: 'test-player-id',
      userName: 'Test Player',
      pets: [{ id: 'put-test-id-here', petType: 'Bear', ownerId: 'put-test-player-id-here' }],
    },
    emitPetTransfer: jest.fn(),
  }),
}));

jest.mock('../../../classes/TownController', () => ({
  usePlayers: () => ([
    { id: 'put-test-id-here', userName: 'Test Player' },
    { id: 'put-test-id-here-2', userName: 'Test Player 2' },
  ]),
}));

describe('PetTransferScreen', () => {
  test('renders the pet transfer dialog', () => {
    render(
      <ChakraProvider>
        <PetTransferScreen />
      </ChakraProvider>
    );

    expect(screen.getByText(/Pet Transfers/)).toBeInTheDocument();
  });

});
