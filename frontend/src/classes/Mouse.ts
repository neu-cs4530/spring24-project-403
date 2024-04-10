import BasePet from './BasePet';
import { MouseColor, PetType } from '../types/CoveyTownSocket';

/**
 * A class representing a mouse pet
 */
export default class Mouse extends BasePet {
  /* The colors a mouse can be */
  static mouseColors: MouseColor[] = ['white', 'brown', 'grey'];

  /**
   * Create a new mouse pet
   * @param name the name of the mouse
   * @param ownerId the unique identifier of the mouse's owner
   * @param color the color of the mouse
   */
  constructor(name?: string, ownerId?: string, color?: MouseColor) {
    if (name && ownerId && color) {
      super(name, ownerId, color);
    } else if (!name && !ownerId && !color) {
      // Display constructor for pet shop
      super();
      this._color = super.getRandomColor(Mouse.mouseColors);
    } else {
      throw new Error('Invalid constructor arguments for Mouse object');
    }
    this.petType = 'mouse';
  }

  /* The type of pet */
  readonly petType: PetType;

  /**
   * The sound the mouse makes
   * @returns the sound the mouse makes
   */
  public makeSound(): string {
    return 'Squeak!';
  }
}
