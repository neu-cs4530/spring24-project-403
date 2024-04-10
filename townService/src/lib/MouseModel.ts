import BasePet from './BasePetModel';
import { MouseColor, PetType } from '../types/CoveyTownSocket';

export default class MouseModel extends BasePet {
  readonly petType: PetType;

  constructor(id: string, name?: string, ownerId?: string, color?: MouseColor) {
    super(id, name, ownerId, color);
    this.petType = 'mouse';
  }
}
