import { useEffect, useState } from 'react';
import { ConversationArea as ConversationAreaModel, PetAdoptionCenter } from '../../types/CoveyTownSocket';
import PlayerController from '../PlayerController';
import InteractableAreaController, {
  BaseInteractableEventMap,
  CONVERSATION_AREA_TYPE,
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
    PetAdoptionCenter
> {

  protected _updateFrom(newModel: PetAdoptionCenter): void {
      throw new Error('Method not implemented.');
  }

  private _topic?: string;

  /**
   * Create a new ConversationAreaController
   * @param id
   * @param topic
   */
  constructor(id: string, topic?: string) {
    super(id);
    this._topic = topic;
  }

  public isActive(): boolean {
    return this.occupants.length > 0;
  }

  get friendlyName(): string {
    return this.id;
  }

  get type(): string {
    return CONVERSATION_AREA_TYPE;
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
  toInteractableAreaModel(): ConversationAreaModel {
    return {
      id: this.id,
      occupants: this.occupants.map(player => player.id),
      type: 'PetAdoptionCenter',
    };
  }

  /**
   * Create a new PetAdoptionCenterController to match a given ConversationAreaModel
   * @param convAreaModel Conversation area to represent
   * @param playerFinder A function that will return a list of PlayerController's
   *                     matching a list of Player ID's
   */
  static fromConversationAreaModel(
    convAreaModel: ConversationAreaModel,
    playerFinder: (playerIDs: string[]) => PlayerController[],
  ): PetAdoptionCenterController {
    const ret = new PetAdoptionCenterController(convAreaModel.id, convAreaModel.topic);
    ret.occupants = playerFinder(convAreaModel.occupants);
    return ret;
  }
}
