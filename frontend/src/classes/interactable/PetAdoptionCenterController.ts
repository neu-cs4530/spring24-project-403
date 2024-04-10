import { Pet, PetAdoptionCenter as PetAdoptionCenterModel } from '../../types/CoveyTownSocket';
import PlayerController from '../PlayerController';
import TownController from '../TownController';
import InteractableAreaController, {
  BaseInteractableEventMap,
  PET_ADOPTION_CENTER_TYPE,
} from './InteractableAreaController';

/**
 * The events that the PetAdoptionCenterController emits to subscribers. These events
 * are only ever emitted to local components (not to the townService).
 */
export type PetAdoptionCenterEvents = BaseInteractableEventMap & {
  /**
   * An update event indicates that the pet adoption center has changed pets in some way.
   * Listeners are passed the updated PetAdoptionCenterController.
   */
  update: (petAdoptionCenter: PetAdoptionCenterController) => void;
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
  private _pets: Pet[];

  private _model: PetAdoptionCenterModel;

  protected _townController: TownController;

  /**
   * Create a new PetAdoptionCenterController
   * @param id the unique identifier for this pet adoption center
   * @param townController the TownController that manages this pet adoption center
   */
  constructor(
    id: string,
    townController: TownController,
    PetAdoptionCenter: PetAdoptionCenterModel,
  ) {
    super(id);
    this._townController = townController;
    this._model = PetAdoptionCenter;
    this._pets = this._model.pets;
  }

  /**
   * Adopt a pet from the pet adoption center.
   * @param pet the pet to adopt
   * @returns the pet that was adopted or undefined if the pet was not adopted.
   */
  public adoptPet(pet: Pet | undefined): Pet | undefined {
    if (!pet) {
      return undefined;
    }
    pet.ownerId = this._player?.id;
    this._townController.emitPetAdoption(pet, this.id);
    return pet;
  }

  /**
   * Return the pets in the pet adoption center
   * @returns the pets in the pet adoption center
   */
  public get pets(): Pet[] {
    if (!this._pets || this._pets.length === 0) {
      this._townController.emitPetAdoptionCenterAreaUpdate(this);
    }
    return this._pets;
  }

  /**
   * Return the number of pets in the pet adoption center
   * @returns the number of pets in the pet adoption center
   */
  public get playerPetCount(): number {
    if (!this._pets || this._pets.length === 0) {
      this._townController.emitPetAdoptionCenterAreaUpdate(this);
    }
    return this._player?.pets?.length || 0;
  }

  /**
   * Update this controller with new data of the pet adoption center model.
   * @param newModel the new data of the pet adoption center model
   */
  protected _updateFrom(newModel: PetAdoptionCenterModel): void {
    this.occupants = newModel.occupants.map(occupantID =>
      this._townController.getPlayer(occupantID),
    );
    this._pets = newModel.pets;
    this.emit('update', this);
  }

  /**
   * Is the pet adoption center active?
   * @returns true if the pet adoption center is active, false otherwise.
   */
  public isActive() {
    return this.occupants.length > 0;
  }

  /**
   * Return the friendly name of the pet adoption center
   * @returns the friendly name of the pet adoption center
   */
  public get friendlyName(): string {
    return this.id;
  }

  /**
   * Return the type of the pet adoption center.
   * @returns the type of the pet adoption center
   */
  public get type(): string {
    return PET_ADOPTION_CENTER_TYPE;
  }

  /**
   * A pet adoption center is empty if there are no occupants in it.
   * @returns true if the pet adoption center is empty, false otherwise.
   */
  public isEmpty(): boolean {
    return this.occupants.length === 0;
  }

  /**
   * Return a representation of this PetAdoptionCenterController that matches the
   * townService's representation and is suitable for transmitting over the network.
   * @returns a representation of this PetAdoptionCenterController
   */
  public toInteractableAreaModel(): PetAdoptionCenterModel {
    return {
      id: this.id,
      occupants: this.occupants.map(player => player.id),
      type: 'PetAdoptionCenter',
      pets: this._pets,
    };
  }

  /**
   * The player in the pet adoption center if there is one, or undefined otherwise
   * @returns the player in the pet adoption center if there is one, or undefined otherwise
   */
  private get _player(): PlayerController | undefined {
    const ourPlayer = this.occupants.find(
      occupant => occupant.id === this._townController.ourPlayer.id,
    );
    return ourPlayer;
  }
}
