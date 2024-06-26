import BasePet from './BasePet';
import { BearColor, PetType } from '../types/CoveyTownSocket';

/**
 * A class representing a bear pet
 */
export default class Bear extends BasePet {
  /* The colors a bear can be */
  static bearColors: BearColor[] = ['black', 'brown'];

  /**
   * Create a new bear pet
   * @param name the name of the bear
   * @param ownerId the unique identifier of the bear's owner
   * @param color the color of the bear
   */
  constructor(name?: string, ownerId?: string, color?: BearColor) {
    if (name && ownerId && color) {
      super(name, ownerId, color);
    } else if (!name && !ownerId && !color) {
      // Display constructor for pet shop
      super();
      this._color = super.getRandomColor(Bear.bearColors);
    } else {
      throw new Error('Invalid constructor arguments for Bear object');
    }
    this.petType = 'bear';
  }

  /* The type of pet */
  readonly petType: PetType;

  /**
   * The sound the bear makes
   * @returns the sound the bear makes
   */
  public makeSound(): string {
    return 'Grrrr!';
  }
}
