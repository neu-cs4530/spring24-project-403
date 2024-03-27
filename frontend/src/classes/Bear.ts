import BasePet from './BasePet';

type BearColor = 'black' | 'brown';

export default class Bear extends BasePet {
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
  }

  public makeSound(): string {
    return 'Awooo!';
  }
}