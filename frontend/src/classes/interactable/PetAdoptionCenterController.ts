import { PetAdoptionCenter } from '../../types/CoveyTownSocket';
import BasePet from '../BasePet';
import Bear from '../Bear';
import Mouse from '../Mouse';
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
  PetAdoptionCenter
> {
  MAX_PETS = 20;

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

  public get pets(): BasePet[] {
    this._model.pets = this.getRandomizedPets();
    return this._model.pets;
  }

  protected _updateFrom(newModel: PetAdoptionCenter): void {
    throw new Error('Method not implemented.');
  }

  private _model: PetAdoptionCenter;

  /**
   * Constructs a new ViewingAreaController, initialized with the state of the
   * provided viewingAreaModel.
   *
   * @param petAdoptionCenter The viewing area model that this controller should represent
   */
  constructor(petAdoptionCenter: PetAdoptionCenter) {
    super(petAdoptionCenter.id);
    this._model = petAdoptionCenter;
  }

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
  toInteractableAreaModel(): PetAdoptionCenter {
    return this._model;
  }
}
