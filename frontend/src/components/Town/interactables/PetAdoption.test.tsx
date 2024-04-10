import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { mock, mockReset } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import { act } from 'react-dom/test-utils';
import { randomLocation } from '../../../TestUtils';
import PlayerController from '../../../classes/PlayerController';
import TownController, * as TownControllerHooks from '../../../classes/TownController';
import InteractableAreaController from '../../../classes/interactable/InteractableAreaController';
import { PetAdoptionCenterEvents } from '../../../classes/interactable/PetAdoptionCenterController';
import TownControllerContext from '../../../contexts/TownControllerContext';
import { GameResult, InteractableType, Pet, PetAdoptionCenter as PetAdoptionCenterModel } from '../../../types/CoveyTownSocket';
import AdoptionCenterModal from './AdoptionCenterModal';
import GamesArea from './GamesArea';
import PetTransferScreen from './PetTransferScreen';
import React from 'react';
import PetActiveScreen from './PetActiveScreen';


const mockToast = jest.fn();
jest.mock('@chakra-ui/react', () => {
  const ui = jest.requireActual('@chakra-ui/react');
  const mockUseToast = () => mockToast;
  return {
    ...ui,
    useToast: mockUseToast,
  };
});

const useInteractableAreaControllerSpy = jest.spyOn(
  TownControllerHooks,
  'useInteractableAreaController',
);

const petAdoptionCenter = mock<PetAdoptionCenterModel>({
  id: nanoid(),
  type: 'PetAdoptionCenter',
  pets: [], // Add the 'pets' property
});


const petTransferScreenComponentSpy = jest.spyOn(PetTransferScreen, 'default' as never);
petTransferScreenComponentSpy.mockReturnValue(<div data-testid='pet transfer' /> as never);

const petActiveScreenComponentSpy = jest.spyOn(PetActiveScreen, 'default' as never);
petActiveScreenComponentSpy.mockReturnValue(<div data-testid='active pet' /> as never);

class MockPetAdoptionCenterController extends InteractableAreaController<
PetAdoptionCenterEvents,
PetAdoptionCenterModel
>  {
  protected _updateFrom(newModel: PetAdoptionCenterModel): void {
    return;
  }
  public get friendlyName(): string {
    return 'Pet Adoption Center';
  }

  private _pets: Pet[] = [];
  private _model: PetAdoptionCenterModel;
  private _mockID: string = 'mockID';
  private _type: InteractableType = 'PetAdoptionCenter';

  public constructor(model : PetAdoptionCenterModel) {
    super('mockID');
    this._model = model;
  }

  public get id() {
    return this._mockID;
  }

  public set id(newID: string) {
    this._mockID = newID;
  }

  public set type(type: InteractableType) {
    this._type = type;
  }

  public toInteractableAreaModel(): PetAdoptionCenterModel {
    return {
      id: this.id,
      occupants: this.occupants.map(player => player.id),
      type: 'PetAdoptionCenter',
      pets: [],
    };
  }

  public isActive(): boolean {
    return true;
  }
}
describe('PetAdoptionCenter', () => {
  // Spy on console.error and intercept react key warnings to fail test
  let consoleErrorSpy: jest.SpyInstance<void, [message?: any, ...optionalParms: any[]]>;
  beforeAll(() => {
    // Spy on console.error and intercept react key warnings to fail test
    consoleErrorSpy = jest.spyOn(global.console, 'error');
    consoleErrorSpy.mockImplementation((message?, ...optionalParams) => {
      const stringMessage = message as string;
      if (stringMessage.includes && stringMessage.includes('children with the same key,')) {
        throw new Error(stringMessage.replace('%s', optionalParams[0]));
      } else if (stringMessage.includes && stringMessage.includes('warning-keys')) {
        throw new Error(stringMessage.replace('%s', optionalParams[0]));
      }
      // eslint-disable-next-line no-console -- we are wrapping the console with a spy to find react warnings
      console.warn(message, ...optionalParams);
    });
  });
  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });
  let ourPlayer: PlayerController;
  const townController = mock<TownController>();
  Object.defineProperty(townController, 'ourPlayer', { get: () => ourPlayer });
  let petAdoptionCenterController = new MockPetAdoptionCenterController(petAdoptionCenter);
  function setGameAreaControllerID(id: string) {
    petAdoptionCenterController.id = id;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mockGameArea.id = id;
  }

  beforeEach(() => {
    ourPlayer = new PlayerController('player x', 'player x', randomLocation());
    mockReset(townController);
    useInteractableAreaControllerSpy.mockReturnValue(petAdoptionCenterController);
    setGameAreaControllerID(nanoid());
    petTransferScreenComponentSpy.mockClear();
    mockToast.mockClear();
    petActiveScreenComponentSpy.mockClear();
  });
  function renderGamesArea() {
    return render(
      <ChakraProvider>
        <TownControllerContext.Provider value={townController}>
          <GamesArea />
        </TownControllerContext.Provider>
      </ChakraProvider>,
    );
  }

  describe('[T2.4] Rendering the correctly', () => {
    test('If the interactableID is for a pet adoption center, the area should be rendered', () => {
      petAdoptionCenterController.type = 'PetAdoptionCenter';
      renderGamesArea();
      expect(screen.getByTestId('petAdoptionCenter')).toBeInTheDocument();
    });
  });
  describe('[T2.1] Listeners', () => {
    it('Registers exactly one listeners when mounted: for gameUpdated', () => {
      const addListenerSpy = jest.spyOn(petAdoptionCenterController, 'addListener');
      addListenerSpy.mockClear();

      renderGamesArea();
      expect(addListenerSpy).toBeCalledTimes(1);
      expect(addListenerSpy).toHaveBeenCalledWith('gameUpdated', expect.any(Function));
    });
    it('Does not register listeners on every render', () => {
      const removeListenerSpy = jest.spyOn(petAdoptionCenterController, 'removeListener');
      const addListenerSpy = jest.spyOn(petAdoptionCenterController, 'addListener');
      addListenerSpy.mockClear();
      removeListenerSpy.mockClear();
      const renderData = renderGamesArea();
      expect(addListenerSpy).toBeCalledTimes(1);
      addListenerSpy.mockClear();

      renderData.rerender(
        <ChakraProvider>
          <TownControllerContext.Provider value={townController}>
            <GamesArea />
          </TownControllerContext.Provider>
        </ChakraProvider>,
      );

      expect(addListenerSpy).not.toBeCalled();
      expect(removeListenerSpy).not.toBeCalled();
    });
    it('Removes the listeners when the component is unmounted', () => {
      const removeListenerSpy = jest.spyOn(petAdoptionCenterController, 'removeListener');
      const addListenerSpy = jest.spyOn(petAdoptionCenterController, 'addListener');
      addListenerSpy.mockClear();
      removeListenerSpy.mockClear();
      const renderData = renderGamesArea();
      expect(addListenerSpy).toBeCalledTimes(1);
      const addedListeners = addListenerSpy.mock.calls;
      const addedGameUpdateListener = addedListeners.find(call => call[0] === 'gameUpdated');
      expect(addedGameUpdateListener).toBeDefined();
      renderData.unmount();
      expect(removeListenerSpy).toBeCalledTimes(1);
      const removedListeners = removeListenerSpy.mock.calls;
      const removedGameUpdateListener = removedListeners.find(call => call[0] === 'gameUpdated');
      expect(removedGameUpdateListener).toEqual(addedGameUpdateListener);
    });
    it('Creates new listeners if the gameAreaController changes', () => {
      const removeListenerSpy = jest.spyOn(petAdoptionCenterController, 'removeListener');
      const addListenerSpy = jest.spyOn(petAdoptionCenterController, 'addListener');
      addListenerSpy.mockClear();
      removeListenerSpy.mockClear();
      const renderData = renderGamesArea();
      expect(addListenerSpy).toBeCalledTimes(1);

      petAdoptionCenterController = new MockPetAdoptionCenterController(petAdoptionCenter);
      const removeListenerSpy2 = jest.spyOn(petAdoptionCenterController, 'removeListener');
      const addListenerSpy2 = jest.spyOn(petAdoptionCenterController, 'addListener');

      useInteractableAreaControllerSpy.mockReturnValue(petAdoptionCenterController);
      renderData.rerender(
        <ChakraProvider>
          <TownControllerContext.Provider value={townController}>
            <AdoptionCenterModal />
          </TownControllerContext.Provider>
        </ChakraProvider>,
      );
      expect(removeListenerSpy).toBeCalledTimes(1);

      expect(addListenerSpy2).toBeCalledTimes(1);
      expect(removeListenerSpy2).not.toBeCalled();
    });
  });
});
