import {PetAdoptionCenter as PetAdoptionCenterModel} from '../../types/CoveyTownSocket';
import InteractableAreaController, {
  BaseInteractableEventMap,
  PET_ADOPTION_CENTER_TYPE,
} from './InteractableAreaController';

/**
 * The events that the PetAdoptionCenterController emits to subscribers. These events
 * are only ever emitted to local components (not to the townService).
 */
export type PetAdoptionCenterEvents = BaseInteractableEventMap & {
  // TODO
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

  protected _updateFrom(newModel: PetAdoptionCenterModel): void {
      throw new Error('Method not implemented.');
  }

  private _model: PetAdoptionCenterModel;

  /**
   * Constructs a new ViewingAreaController, initialized with the state of the
   * provided viewingAreaModel.
   *
   * @param petAdoptionCenter The viewing area model that this controller should represent
   */
  constructor(petAdoptionCenter: PetAdoptionCenterModel) {
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
  toInteractableAreaModel(): PetAdoptionCenterModel {
    return this._model;
  }
}
