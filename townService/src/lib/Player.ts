import { nanoid } from 'nanoid';
import { Player as PlayerModel, PlayerLocation, TownEmitter, Pet } from '../types/CoveyTownSocket';

/**
 * Each user who is connected to a town is represented by a Player object
 */
export default class Player {
  /** The current location of this user in the world map * */
  public location: PlayerLocation;

  /** The unique identifier for this player * */
  private readonly _id: string;

  /** The player's username, which is not guaranteed to be unique within the town * */
  private readonly _userName: string;

  /** The secret token that allows this client to access our Covey.Town service for this town * */
  private readonly _sessionToken: string;

  /** The secret token that allows this client to access our video resources for this town * */
  private _videoToken?: string;

  /** A special town emitter that will emit events to the entire town BUT NOT to this player */
  public readonly townEmitter: TownEmitter;

  /** A list of pets associated with this player */
  public pets: Pet[] | [];

  constructor(userName: string, townEmitter: TownEmitter) {
    this.location = {
      x: 0,
      y: 0,
      moving: false,
      rotation: 'front',
    };
    this._userName = userName;
    this._id = nanoid();
    this._sessionToken = nanoid();
    this.townEmitter = townEmitter;
    this.pets = [];
  }

  /**
   * Sets the active pet for this player.
   * @param petData The pet to be set as the active pet.
   */
  public setActivePet(petData: Pet) {
    this.pets = this.pets.filter(pet => pet.id !== petData.id);
    this.pets = [petData, ...this.pets];
  }

  /**
   * Adds a pet to the player's list of pets.
   * @param pet The pet to be added.
   * @returns The updated player model.
   */
  public addPet(pet: Pet): PlayerModel {
    if ((this.pets as Pet[]).includes(pet)) {
      return this.toPlayerModel();
    }
    this.pets = [pet, ...this.pets];
    return this.toPlayerModel();
  }

  /**
   * Removes a pet from the player's list of pets.
   * @param petData The pet to be removed.
   * @returns The updated player model.
   */
  public removePet(petData: Pet): PlayerModel {
    this.pets = (this.pets as Pet[]).filter(pet => pet.id !== petData.id);
    return this.toPlayerModel();
  }

  get userName(): string {
    return this._userName;
  }

  get id(): string {
    return this._id;
  }

  set videoToken(value: string | undefined) {
    this._videoToken = value;
  }

  get videoToken(): string | undefined {
    return this._videoToken;
  }

  get sessionToken(): string {
    return this._sessionToken;
  }

  toPlayerModel(): PlayerModel {
    return {
      id: this._id,
      location: this.location,
      userName: this._userName,
      pets: this.pets,
    };
  }
}
