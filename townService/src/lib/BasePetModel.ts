import { Pet as PetModel, PetType } from '../types/CoveyTownSocket';

/**
 * An abstract class representing the basic attributes of a pet in the game
 */
export default abstract class BasePetModel implements PetModel {
  /** The unique identifier for this pet * */
  private _id: string;

  /** The pet's name, which is not guaranteed to be unique within the town
   *  We will allow renaming of pets */
  protected _name?: string;

  /** The unique identifier of the pet's owner * */
  private _ownerId?: string;

  // protected abstract _color: string;
  protected _color?: string;

  constructor(id: string, petType: PetType, name?: string, ownerId?: string, color?: string) {
    this._id = id;
    this.petType = petType;
    this._name = name;
    this._ownerId = ownerId;
    this._color = color;
  }

  petType!: PetType;

  public get name(): string | undefined {
    return this._name;
  }

  public get id(): string {
    return this._id;
  }

  public get ownerId(): string | undefined {
    return this._ownerId;
  }

  public get color(): string | undefined {
    return this._color;
  }

  public toPetModel(): PetModel {
    return {
      id: this._id,
      name: this._name,
      petType: this.petType,
      ownerId: this._ownerId,
      color: this._color,
    };
  }
}
