import { Pet, PetAdoptionCenter as PetAdoptionCenterModel } from '../../types/CoveyTownSocket';
import BasePet from '../BasePet';
import Bear from '../Bear';
import Mouse from '../Mouse';
import PlayerController from '../PlayerController';
import TownController from '../TownController';
import Wolf from '../Wolf';
import InteractableAreaController, {
  BaseInteractableEventMap,
  PET_ADOPTION_CENTER_TYPE,
} from './InteractableAreaController';

/**
 * The events that the PetAdoptionCenterController emits to subscribers. These events
 * are only ever emitted to local components (not to the townService).
 */
export type PetAdoptionCenterEvents = BaseInteractableEventMap & {
  // TODO : Likely need to add "Adopt" event here
};

/**
 * A PetAdoptionCenterController manages the local behavior of the Pet Adoption Center in the frontend,
 * implementing the logic to bridge between the townService's interpretation of the adoption center and the
 * frontend's. The PetAdoptionCenterController emits events when the pet adoption center changes.
 */
export default class PetAdoptionCenterController extends InteractableAreaController<
  PetAdoptionCenterEvents,
  PetAdoptionCenterModel
> {


  MAX_PETS = 5;
  private _pet?: Pet;
  private _pets: BasePet[] = [];
  protected _townController: TownController;

    /**
   * Create a new VehicleRackAreaController
   * @param id
   * @param vehicle
   * @param townController
   */
    constructor(id: string, townController: TownController, pet?: Pet) {
      super(id);
      this._townController = townController;
      this._pet = pet;
    }
  

  getRandomizedPets(): BasePet[] {
    const pets: BasePet[] = [];
    for (let i = 0; i < this.MAX_PETS; i++) {
      if (Math.random() < 0.3) {
        pets.push(new Wolf());
      } else if (Math.random() < 0.6) {
        pets.push(new Mouse());
      } else {
        pets.push(new Bear());
      }
    }
    return pets;
  }

  adoptPet() {
    const pet = this._player?.adoptPet(this._pet);
    console.log('Adopting pet: ', pet?.id);
    this._townController.emitPetChange(pet);
    return pet;
  }

  /**
   * Set vehicle to undefined when selecting no vehicle
   */
  set pet(newPet: Pet | undefined) {
    this._pet = newPet;
  }

  public get pets(): BasePet[] {
    this._pets = this.getRandomizedPets();
    return this._pets;
  }

  protected _updateFrom(): void {}

  public isActive(): boolean {
    return this.occupants.length > 0;
  }

  get friendlyName(): string {
    return this.id;
  }

  get type(): string {
    return PET_ADOPTION_CENTER_TYPE;
  }

  /**
   * A conversation area is empty if there are no occupants in it.
   */
  isEmpty(): boolean {
    return this.occupants.length === 0;
  }

  /**
   * Return a representation of this ConversationAreaController that matches the
   * townService's representation and is suitable for transmitting over the network.
   */
  toInteractableAreaModel(): PetAdoptionCenterModel {
    return {
      id: this.id,
      occupants: this.occupants.map(player => player.id),
      type: 'PetAdoptionCenter',
    };
  }

    /**
   * Returns the player playing the game if there is one, or undefined otherwise
   */
    private get _player(): PlayerController | undefined {
      const ourPlayer = this.occupants.find(
        occupant => occupant.id === this._townController.ourPlayer.id,
      );
      console.log('Occupants:', this.occupants);
      console.log('Our player in town controller:', this._townController.ourPlayer);
      console.log('Our player:', ourPlayer);
      return ourPlayer;
    }
}
