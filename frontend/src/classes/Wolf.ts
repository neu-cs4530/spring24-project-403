import BasePet from './BasePet';
import { WolfColor, PetType } from '../types/CoveyTownSocket';

export default class Wolf extends BasePet {
  /* The colors a wolf can be */
  static wolfColors: WolfColor[] = ['grey', 'brown'];

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
