import BasePet from './BasePet';
import { WolfColor, PetType } from '../types/CoveyTownSocket';

/**
 * A class representing a wolf pet
 */
export default class Wolf extends BasePet {
  /* The colors a wolf can be */
  static wolfColors: WolfColor[] = ['grey', 'brown'];

  /**
   * Create a new wolf pet
   * @param name the name of the wolf
   * @param ownerId the unique identifier of the wolf's owner
   * @param color the color of the wolf
   */
  constructor(name?: string, ownerId?: string, color?: WolfColor) {
    if (name && ownerId && color) {
      super(name, ownerId, color);
      this.petType = 'wolf';
    } else if (!name && !ownerId && !color) {
      // Display constructor for pet shop
      super();
      this._color = super.getRandomColor(Wolf.wolfColors);
    } else {
      throw new Error('Invalid constructor arguments for Wolf object');
    }
    this.petType = 'wolf';
  }

  /* The type of pet */
  readonly petType: PetType;

  /**
   * The sound the wolf makes
   * @returns the sound the wolf makes
   */
  public makeSound(): string {
    return 'Awooo!';
  }
}
