import BasePet from './BasePetModel';
import { WolfColor, PetType } from '../types/CoveyTownSocket';

export default class WolfModel extends BasePet {
  readonly petType: PetType;

  constructor(id: string, name?: string, ownerId?: string, color?: WolfColor) {
    super(id, name, ownerId, color);
    this.petType = 'wolf';
  }
}
