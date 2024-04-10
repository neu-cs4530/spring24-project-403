import BasePet from './BasePetModel';
import { MouseColor, PetType } from '../types/CoveyTownSocket';

export default class MouseModel extends BasePet {
  readonly petType: PetType;

  /**
   * Create a new mouse pet
   * @param id the unique identifier for this pet
   * @param name the name of the mouse
   * @param ownerId the unique identifier of the mouse's owner
   * @param color the color of the mouse
   */
  constructor(id: string, name?: string, ownerId?: string, color?: MouseColor) {
    super(id, name, ownerId, color);
    this.petType = 'mouse';
  }
}
