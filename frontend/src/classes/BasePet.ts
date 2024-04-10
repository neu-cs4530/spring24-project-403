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

  // protected abstract _color: string;
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

  petType!: PetType;

  get name(): string | undefined {
    return this._name;
  }

  set name(value: string | undefined) {
    this._name = value;
  }

  get id(): string {
    return this._id;
  }

  get ownerId(): string | undefined {
    return this._ownerId;
  }

  set ownerId(value: string | undefined) {
    this._ownerId = value;
  }

  get color(): string | undefined {
    return this._color;
  }

  // Setter if we want to allow user customization for changing pet color
  set color(value: string | undefined) {
    this._color = value;
  }

  public getRandomColor(options: string[]): string {
    return options[Math.floor(Math.random() * options.length)];
  }

  toPetModel(): PetModel {
    return {
      id: this._id,
      name: this._name,
      petType: this.petType,
      ownerId: this._ownerId,
      color: this._color,
    };
  }

  public abstract makeSound(): string;
}
