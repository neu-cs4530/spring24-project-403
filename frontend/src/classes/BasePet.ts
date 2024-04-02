import { nanoid } from 'nanoid';
import Accessory from './Accessory';
import { Pet, PetType } from '../types/CoveyTownSocket';

/**
 * An abstract class representing the basic attributes of a pet in the game
 */
export default abstract class BasePet implements Pet {
  /** The unique identifier for this pet * */
  private readonly _id: string;

  /** The pet's name, which is not guaranteed to be unique within the town
   *  We will allow renaming of pets */
  protected _name?: string;

  /** The unique identifier of the pet's owner * */
  private _ownerId?: string;

  // protected abstract _color: string;
  protected _color?: string;

  private readonly _accessories: Accessory[] = [];

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

  get accessories(): Accessory[] {
    return this._accessories;
  }

  public getRandomColor(options: string[]): string {
    return options[Math.floor(Math.random() * options.length)];
  }

  public addAccessory(accessory: Accessory): void {
    this._accessories.push(accessory);
  }

  public removeAccessory(accessory: Accessory): void {
    const index = this._accessories.indexOf(accessory);
    if (index > -1) {
      this._accessories.splice(index, 1);
    } else {
      throw new Error('Pet does not have this accessory');
    }
  }

  public abstract makeSound(): string;
}
