import BasePet from './BasePetModel';
import { BearColor, PetType } from '../types/CoveyTownSocket';

export default class BearModel extends BasePet {
  readonly petType: PetType;

  constructor(id: string, name?: string, ownerId?: string, color?: BearColor) {
    super(id, name, ownerId, color);
    this.petType = 'bear';
  }
}
