import { nanoid } from 'nanoid';
// import { TownEmitter } from '../types/CoveyTownSocket';
import Accessory from './Accessory';

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
  private _name: string;

  /** The unique identifier of the pet's owner * */
  private readonly _ownerId?: string;

  abstract readonly _color: string;

  private readonly _accessories: Accessory[] = [];

  // Do we need town emitter for pets? TBD
  // public readonly townEmitter: TownEmitter;

  constructor(name: string, ownerId: string /* townEmitter: TownEmitter */) {
    this._name = name;
    this._id = nanoid();
    this._ownerId = ownerId;
    // this.townEmitter = townEmitter;
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
  public abstract move(): void;
}
