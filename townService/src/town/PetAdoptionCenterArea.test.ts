import { mock, mockClear } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import Player from '../lib/Player';
import { getLastEmittedEvent } from '../TestUtils';
import { TownEmitter } from '../types/CoveyTownSocket';
import PetAdoptionCenter from './PetAdoptionCenterArea';

describe('PetAdoptionCenterArea', () => {
  const testAreaBox = { x: 100, y: 100, width: 100, height: 100 };
  let testArea: PetAdoptionCenter;
  const townEmitter = mock<TownEmitter>();
  const id = nanoid();
  let newPlayer: Player;

  beforeEach(() => {
    mockClear(townEmitter);
    testArea = new PetAdoptionCenter({ id, pets: [], occupants: [] }, testAreaBox, townEmitter);
    newPlayer = new Player(nanoid(), mock<TownEmitter>());
    testArea.add(newPlayer);
  });

  describe('testing testing', () => {});
});
