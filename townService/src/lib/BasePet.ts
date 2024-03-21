import { nanoid } from 'nanoid';
// import { TownEmitter } from '../types/CoveyTownSocket';
import Accessory from './Accessory';

export function getRandomColor(enumType: Record<string, unknown>): string {
  const values = Object.values(enumType) as string[]; // Add type assertion
  return values[Math.floor(Math.random() * Object.keys(enumType).length)];
}

/**
 * An abstract class representing the basic attributes of a pet in the game
 */
export default abstract class BasePet {
  /** The current location of this pet in the world map * */
  // Don't need this yet - pets will follow player around
  // public location: PetLocation;

  /** The unique identifier for this pet * */
  private readonly _id: string;

  /** The pet's name, which is not guaranteed to be unique within the town
   *  We will allow renaming of pets */
  protected _name: string;

  /** The unique identifier of the pet's owner * */
  private _ownerId?: string;

  // protected abstract _color: string;
  private _color?: string;

  private readonly _accessories: Accessory[] = [];

  // Do we need town emitter for pets? TBD
  // public readonly townEmitter: TownEmitter;

  constructor(name?: string, ownerId?: string, color?: string /* townEmitter: TownEmitter */) {
    if (name && ownerId && color) {
      this._name = name;
      this._ownerId = ownerId;
    } else if (!name && !ownerId && !color) {
      // Display constructor for pet shop
      this._name = '';
      this._ownerId = '';
    } else {
      throw new Error('Invalid constructor arguments');
    }
    // this.townEmitter = townEmitter;
    this._color = color;
    this._id = nanoid();
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get id(): string {
    return this._id;
  }

  get ownerId(): string | undefined {
    return this._ownerId;
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

  // TBD: do we want this to be abstract?
  // Probably not? We can have a default implementation that moves similar to the player?
  public move(): void {
    // TODO: implement pet movement, linked to player movement
    // Need a petcontroller? Or can we just link it to/use the playercontroller?
  }
}
