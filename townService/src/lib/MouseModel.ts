import BasePet from './BasePetModel';
import { MouseColor } from '../types/CoveyTownSocket';

export default class MouseModel extends BasePet {
  constructor(id: string, name?: string, ownerId?: string, color?: MouseColor) {
    super(id, 'mouse', name, ownerId, color);
  }
}
