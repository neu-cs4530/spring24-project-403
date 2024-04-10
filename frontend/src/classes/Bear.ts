import BasePet from './BasePet';
import { BearColor, PetType } from '../types/CoveyTownSocket';

export default class Bear extends BasePet {
  /* The colors a bear can be */
  static bearColors: BearColor[] = ['black', 'brown'];

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
