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
   * An update event indicates that the pet adoption center has changed in some way.
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
  private _model : PetAdoptionCenterModel;
  protected _townController: TownController;

  /**
   * Create a new PetAdoptionCenterController
   * @param id
   * @param townController
   */
  constructor(id: string, townController: TownController, PetAdoptionCenter: PetAdoptionCenterModel) {
    super(id);
    this._townController = townController;
    this._model = PetAdoptionCenter;
    this._pets = this._model.pets;
    console.log('PetAdoptionCenterController constructor', PetAdoptionCenter);
  }

  public adoptPet(pet: Pet | undefined) {
    if (!pet) {
      return undefined;
    }
    pet.ownerId = this._player?.id;
    console.log('Adopting pet (controller): ', pet?.id);
    this._townController.emitPetChange(pet);
    return pet;
  }

  public get pets(): Pet[] {
    console.log('Asking controller for pets');
    if (!this._pets || this._pets.length === 0) {
      this._townController.emitPetAdoptionCenterAreaUpdate(this);
    }
    return this._pets;
  }

  protected _updateFrom(newModel: PetAdoptionCenterModel): void {
    console.log('Updating pet adoption center from: ', newModel);
    this.occupants = newModel.occupants.map(occupantID =>
      this._townController.getPlayer(occupantID),
    );
    this._pets = newModel.pets;
    this.emit('update', this);
  }

  public isActive() {
    return this.occupants.length > 0;
  }

  public get friendlyName(): string {
    return this.id;
  }

  public get type(): string {
    return PET_ADOPTION_CENTER_TYPE;
  }

  /**
   * A pet adoption center is empty if there are no occupants in it.
   */
  public isEmpty(): boolean {
    return this.occupants.length === 0;
  }

  /**
   * Return a representation of this PetAdoptionCenterController that matches the
   * townService's representation and is suitable for transmitting over the network.
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
   * Returns the player in the pet adoption center if there is one, or undefined otherwise
   */
  private get _player(): PlayerController | undefined {
    const ourPlayer = this.occupants.find(
      occupant => occupant.id === this._townController.ourPlayer.id,
    );
    return ourPlayer;
  }
}
