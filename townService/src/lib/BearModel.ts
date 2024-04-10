import BasePet from './BasePetModel';
import { BearColor, PetType } from '../types/CoveyTownSocket';

export default class BearModel extends BasePet {
  readonly petType: PetType;

  /**
   * Create a new bear pet
   * @param id the unique identifier for this pet
   * @param name the name of the bear
   * @param ownerId the unique identifier of the bear's owner
   * @param color the color of the bear
   */
  constructor(id: string, name?: string, ownerId?: string, color?: BearColor) {
    super(id, name, ownerId, color);
    this.petType = 'bear';
  }
}
