import BasePet from './BasePet';
import { MouseColor } from '../types/CoveyTownSocket';

export default class Mouse extends BasePet {
  static mouseColors: MouseColor[] = ['white', 'brown', 'grey'];

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

  public makeSound(): string {
    return 'Squeak!';
  }
}
