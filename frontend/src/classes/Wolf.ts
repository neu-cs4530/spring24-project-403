import BasePet from './BasePet';

type WolfColor = 'grey' | 'white' | 'black' | 'brown';

export default class Wolf extends BasePet {
  static wolfColors: WolfColor[] = ['grey', 'white', 'black', 'brown'];

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

  public makeSound(): string {
    return 'Awooo!';
  }
}
