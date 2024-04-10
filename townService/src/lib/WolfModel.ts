import BasePet from './BasePetModel';
import { WolfColor, PetType } from '../types/CoveyTownSocket';

/**
 * A class representing a wolf pet
 */
export default class WolfModel extends BasePet {
  readonly petType: PetType;

  /**
   * Create a new wolf pet
   * @param id the unique identifier for this pet
   * @param name the name of the wolf
   * @param ownerId the unique identifier of the wolf's owner
   * @param color the color of the wolf
   */
  constructor(id: string, name?: string, ownerId?: string, color?: WolfColor) {
    super(id, name, ownerId, color);
    this.petType = 'wolf';
  }
}
