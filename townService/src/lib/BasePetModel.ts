import { Pet as PetModel, PetType } from '../types/CoveyTownSocket';

/**
 * An abstract class representing the basic attributes of a pet in the game
 */
export default abstract class BasePetModel implements PetModel {
  /** The unique identifier for this pet */
  private _id: string;

  /** The pet's name, which is not guaranteed to be unique within the town */
  protected _name?: string;

  /** The unique identifier of the pet's owner */
  private _ownerId?: string;

  /** The color of the pet */
  protected _color?: string;

  /** The type of pet */
  abstract readonly petType: PetType;

  constructor(id: string, name?: string, ownerId?: string, color?: string) {
    this._id = id;
    this._name = name;
    this._ownerId = ownerId;
    this._color = color;
  }

  /**
   * The name of the pet
   * @returns the name of the pet
   */
  public get name(): string | undefined {
    return this._name;
  }

  /**
   * The unique identifier for this pet
   * @returns the unique identifier for this pet
   */
  public get id(): string {
    return this._id;
  }

  /**
   * The unique identifier of the pet's owner
   * @returns the unique identifier of the pet's owner
   */
  public get ownerId(): string | undefined {
    return this._ownerId;
  }

  /**
   * The color of the pet
   * @returns the color of the pet
   */
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
