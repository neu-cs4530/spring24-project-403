import { nanoid } from 'nanoid';
import { Pet as PetModel, PetType } from '../types/CoveyTownSocket';

/**
 * An abstract class representing the basic attributes of a pet in the game
 */
export default abstract class BasePet implements PetModel {
  /** The unique identifier for this pet * */
  private readonly _id: string;

  /** The pet's name, which is not guaranteed to be unique within the town
   *  We will allow renaming of pets */
  protected _name?: string;

  /** The unique identifier of the pet's owner * */
  private _ownerId?: string;

  /** The color of the pet * */
  protected _color?: string;

  constructor(name?: string, ownerId?: string, color?: string) {
    if (name && ownerId && color) {
      this._name = name;
      this._ownerId = ownerId;
      this._color = color;
    } else if (!name && !ownerId && !color) {
      // Display constructor for pet shop
      this._name = undefined;
      this._ownerId = undefined;
    } else {
      throw new Error('Invalid constructor arguments');
    }
    this._id = nanoid();
  }

  /* The type of pet */
  abstract readonly petType: PetType;

  /**
   * The name of the pet
   * @returns the name of the pet
   */
  get name(): string | undefined {
    return this._name;
  }

  /**
   * Setter for the name of the pet
   * @param value the new name of the pet
   */
  set name(value: string | undefined) {
    this._name = value;
  }

  /**
   * The unique identifier for this pet
   * @returns the unique identifier for this pet
   */
  get id(): string {
    return this._id;
  }

  /**
   * The unique identifier of the pet's owner
   * @returns the unique identifier of the pet's owner
   */
  get ownerId(): string | undefined {
    return this._ownerId;
  }

  /**
   * Setter for the unique identifier of the pet's owner
   * @param value the new unique identifier of the pet's owner
   */
  set ownerId(value: string | undefined) {
    this._ownerId = value;
  }

  /**
   * The color of the pet
   * @returns the color of the pet
   */
  get color(): string | undefined {
    return this._color;
  }

  /**
   * Setter for the color of the pet
   * @param value the new color of the pet
   */
  set color(value: string | undefined) {
    this._color = value;
  }

  /**
   * Generates a random color for the pet
   * @param options the list of colors to choose from
   * @returns a random color from the list of options
   */
  public getRandomColor(options: string[]): string {
    return options[Math.floor(Math.random() * options.length)];
  }

  /**
   * The sound the pet makes
   * @returns the sound the pet makes
   */
  public abstract makeSound(): string;

  toPetModel(): PetModel {
    return {
      id: this._id,
      name: this._name,
      petType: this.petType,
      ownerId: this._ownerId,
      color: this._color,
    };
  }
}
