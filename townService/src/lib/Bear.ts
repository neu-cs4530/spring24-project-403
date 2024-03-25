import BasePet, { getRandomColor } from './BasePet';

enum BearColor {
  BROWN = 'brown',
  BLACK = 'black',
}

export default class Bear extends BasePet {
  constructor(name?: string, ownerId?: string, color?: BearColor) {
    if (color) {
      super(name, ownerId, color);
    } else {
      // Display constructor for pet shop
      super(name, ownerId, getRandomColor(BearColor));
    }
  }

  public makeSound(): string {
    return 'Grrr!';
  }
}
