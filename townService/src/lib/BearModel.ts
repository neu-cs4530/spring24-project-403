import BasePet from './BasePetModel';
import { BearColor } from '../types/CoveyTownSocket';

export default class BearModel extends BasePet {
  constructor(id: string, name?: string, ownerId?: string, color?: BearColor) {
    super(id, 'bear', name, ownerId, color);
  }
}
