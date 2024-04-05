import BasePet from './BasePetModel';
import { WolfColor } from '../types/CoveyTownSocket';

export default class WolfModel extends BasePet {
  constructor(id: string, name?: string, ownerId?: string, color?: WolfColor) {
    super(id, 'wolf', name, ownerId, color);
  }
}
