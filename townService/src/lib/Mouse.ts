import BasePet, { getRandomColor } from './BasePet';

enum MouseColor {
  WHITE = 'white',
  BROWN = 'brown',
  WHITE_BROWN = 'white_brown',
  GREY = 'grey',
}

export default class Mouse extends BasePet {
  constructor(name?: string, ownerId?: string, color?: MouseColor) {
    if (color) {
      super(name, ownerId, color);
    } else {
      // Display constructor for pet shop
      super(name, ownerId, getRandomColor(MouseColor));
    }
  }

  public makeSound(): string {
    return 'Squeak!';
  }
}
