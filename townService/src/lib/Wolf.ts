import BasePet, { getRandomColor } from './BasePet';

enum WolfColor {
  GREY = 'grey',
  WHITE = 'white',
  BLACK = 'black',
  BROWN = 'brown',
}

export default class Wolf extends BasePet {
  constructor(name?: string, ownerId?: string, color?: WolfColor) {
    if (color) {
      super(name, ownerId, color);
    } else {
      // Display constructor for pet shop
      super(name, ownerId, getRandomColor(WolfColor));
    }
  }

  public makeSound(): string {
    return 'Awooo!';
  }
}
