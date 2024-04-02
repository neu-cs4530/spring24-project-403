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

  private _pets: Pet[] = [];

  protected _townController: TownController;

  /**
   * Create a new PetAdoptionCenterController
   * @param id
   * @param townController
   */
  constructor(id: string, townController: TownController) {
    super(id);
    this._townController = townController;
  }

  getRandomizedPets(): Pet[] {
    const pets: Pet[] = [];
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

  adoptPet(pet: Pet | undefined) {
    if (!pet) {
      return undefined;
    }
    pet.ownerId = this._player?.id;
    console.log('Adopting pet (controller): ', pet?.id);
    this._townController.emitPetChange(pet);
    return pet;
  }

  /** Removes the pet at the given index from this controller's list of pets and replaces with a new randomly generated pet. Returns the new list of pets */
  public replenish(): Pet[] {
    this._pets = this.getRandomizedPets();
    return this._pets;
  }

  public get pets(): Pet[] {
    this._pets = this.getRandomizedPets();
    return this._pets;
  }

  protected _updateFrom(newModel: PetAdoptionCenterModel): void {
    this.occupants = newModel.occupants.map(occupantID =>
      this._townController.getPlayer(occupantID),
    );
  }

  public isActive() {
    return this.occupants.length > 0;
  }

  get friendlyName(): string {
    return this.id;
  }

  get type(): string {
    return PET_ADOPTION_CENTER_TYPE;
  }

  /**
   * A pet adoption center is empty if there are no occupants in it.
   */
  isEmpty(): boolean {
    return this.occupants.length === 0;
  }

  /**
   * Return a representation of this PetAdoptionCenterController that matches the
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
   * Returns the player in the pet adoption center if there is one, or undefined otherwise
   */
  private get _player(): PlayerController | undefined {
    const ourPlayer = this.occupants.find(
      occupant => occupant.id === this._townController.ourPlayer.id,
    );
    return ourPlayer;
  }
}
