import assert from 'assert';
import { mock, mockClear } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
// if we need:
// import Bear from '../Bear';
// import Mouse from '../Mouse';
// import Wolf from '../Wolf';
import PlayerController from '../PlayerController';
import TownController from '../TownController';
import PetAdoptionCenterController, {
  PetAdoptionCenterEvents,
} from './PetAdoptionCenterController';
import { PetAdoptionCenter, PlayerLocation } from '../../../../shared/types/CoveyTownSocket';

describe('PetAdoptionCenterController', () => {
  const ourPlayer = new PlayerController(nanoid(), nanoid(), {
    x: 0,
    y: 0,
    moving: false,
    rotation: 'front',
  });
  const otherPlayers = [
    new PlayerController(nanoid(), nanoid(), { x: 0, y: 0, moving: false, rotation: 'front' }),
    new PlayerController(nanoid(), nanoid(), { x: 0, y: 0, moving: false, rotation: 'front' }),
  ];

  const mockTownController = mock<TownController>();
  Object.defineProperty(mockTownController, 'ourPlayer', {
    get: () => ourPlayer,
  });
  Object.defineProperty(mockTownController, 'players', {
    get: () => [ourPlayer, ...otherPlayers],
  });
  mockTownController.getPlayer.mockImplementation(playerID => {
    const p = mockTownController.players.find(player => player.id === playerID);
    assert(p);
    return p;
  });

  let testArea: PetAdoptionCenterController;
  const mockListeners = mock<PetAdoptionCenterEvents>();
  const petAdoptionCenter: PetAdoptionCenter = {
    id: nanoid(),
    occupants: [ourPlayer.id, ...otherPlayers.map(p => p.id)],
    pets: [],
    type: 'PetAdoptionCenter',
  };
  Object.defineProperties(petAdoptionCenter, {
    id: { value: nanoid() },
    occupants: { value: [ourPlayer.id, ...otherPlayers.map(p => p.id)] },
    pets: { value: [] },
  });

  beforeEach(() => {
    const playerLocation: PlayerLocation = {
      moving: false,
      x: 0,
      y: 0,
      rotation: 'front',
    };
    testArea = new PetAdoptionCenterController(nanoid(), mockTownController, petAdoptionCenter);
    testArea.occupants = [
      new PlayerController(nanoid(), nanoid(), playerLocation),
      new PlayerController(nanoid(), nanoid(), playerLocation),
      new PlayerController(nanoid(), nanoid(), playerLocation),
    ];
    mockClear(mockListeners.occupantsChange);
    mockClear(mockListeners.update);
    testArea.addListener('occupantsChange', mockListeners.occupantsChange);
    testArea.addListener('update', mockListeners.update);
  });

  describe('isEmpty', () => {
    it('Returns true if the occupants list is empty', () => {
      testArea.occupants = [];
      expect(testArea.isEmpty()).toBe(true);
    });
    it('Returns false if the occupants list is set and the topic is defined', () => {
      expect(testArea.isEmpty()).toBe(false);
    });
  });
  describe('setting the occupants property', () => {
    it('does not update the property if the new occupants are the same set as the old', () => {
      const origOccupants = testArea.occupants;
      const occupantsCopy = testArea.occupants.concat([]);
      const shuffledOccupants = occupantsCopy.reverse();
      testArea.occupants = shuffledOccupants;
      expect(testArea.occupants).toEqual(origOccupants);
      expect(mockListeners.occupantsChange).not.toBeCalled();
    });
    it('emits the occupantsChange event when setting the property and updates the model', () => {
      const newOccupants = testArea.occupants.slice(1);
      testArea.occupants = newOccupants;
      expect(testArea.occupants).toEqual(newOccupants);
      expect(mockListeners.occupantsChange).toBeCalledWith(newOccupants);
      expect(testArea.toInteractableAreaModel()).toEqual({
        id: testArea.id,
        pets: testArea.pets,
        occupants: testArea.occupants.map(eachOccupant => eachOccupant.id),
        type: 'PetAdoptionCenter',
      });
    });
  });
});
