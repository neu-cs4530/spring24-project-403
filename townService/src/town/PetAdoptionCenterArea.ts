import { ITiledMapObject } from '@jonbell/tiled-map-type-guard';
import InvalidParametersError from '../lib/InvalidParametersError';
import Player from '../lib/Player';
import {
  BoundingBox,
  InteractableCommand,
  InteractableCommandReturnType,
  InteractableID,
  PetAdoptionCenterCommand,
  TownEmitter,
  PetAdoptionCenter as PetAdoptionCenterModel,
  Pet,
} from '../types/CoveyTownSocket';
import InteractableArea from './InteractableArea';
import WolfModel from '../lib/WolfModel';
import { nanoid } from 'nanoid';
import MouseModel from '../lib/MouseModel';
import BearModel from '../lib/BearModel';

export default class PetAdoptionCenter extends InteractableArea {

  MAX_PETS = 5;
  private _pets: Pet[];

  /**
   * Creates a new PetAdoptionCenter object that will represent a PetAdoptionCenter Area object in the town map.
   * @param id The unique identifier for this pet adoption center
   * @param coordinates The coordinates of the pet adoption center area
   * @param townEmitter An emitter that can be used by this pet adoption center area to broadcast updates to players in the town
   */
  public constructor(
    { id, pets }: Omit<PetAdoptionCenterModel, 'type'>,
    coordinates: BoundingBox,
    townEmitter: TownEmitter,
  ) {
    super(id, coordinates, townEmitter);
    this._pets = pets;
  }

  public removePet(petData: Pet) {
    this._pets = this._pets.filter(pet => pet.id !== petData.id);
    // replace the pet with a new one
    while (this._pets.length < this.MAX_PETS) {
      this._pets.push(this.getRandomizedPets()[0]);
    }
    this._emitAreaChanged();
  }

  getRandomizedPets(): Pet[] {
    const pets: Pet[] = [];
    for (let i = 0; i < this.MAX_PETS; i++) {
      if (Math.random() < 0.3) {
        pets.push(new WolfModel(nanoid()).toPetModel());
      } else if (Math.random() < 0.6) {
        pets.push(new MouseModel(nanoid()).toPetModel());
      } else {
        pets.push(new BearModel(nanoid()).toPetModel());
      }
    }
    return pets;
  }

  /**
   * Updates the state of this ViewingArea, setting the video, isPlaying and progress properties
   *
   * @param viewingArea updated model
   */
  public updateModel({ pets }: PetAdoptionCenterModel): void {
    if (!pets || pets.length === 0) {
      this._pets = this.getRandomizedPets();
    } else {
      this._pets = pets;
    }
    this._emitAreaChanged();
  }

  /**
   * Removes a player from this pet adoption center area.
   *
   * When the last player leaves, this method clears the video of this area and
   * emits that update to all of the players
   *
   * @param player
   */
  public remove(player: Player): void {
    super.remove(player);
    this._emitAreaChanged();
  }

  public get isActive(): boolean {
    return true;
  }

  /**
   * Convert this PetAdoptionCenterArea instance to a simple PetAdoptionCenter suitable for
   * transporting over a socket to a client.
   */
  public toModel(): PetAdoptionCenterModel {
    return {
      id: this.id,
      occupants: this.occupantsByID,
      type: 'PetAdoptionCenter',
      pets: this._pets,
    };
  }

  /**
   * Creates a new Pet Adoption Center object that will represent a PetAdoptionCenter Area object in the town map.
   * @param mapObject An ITiledMapObject that represents a rectangle in which this pet adoption center area exists
   * @param townEmitter An emitter that can be used by this pet adoption center area to broadcast updates to players in the town
   * @returns
   */
  public static fromMapObject(
    mapObject: ITiledMapObject,
    townEmitter: TownEmitter,
  ): PetAdoptionCenter {
    const { name, width, height } = mapObject;
    if (!width || !height) {
      throw new Error(`Malformed pet adoption center area ${name}`);
    }
    const rect: BoundingBox = { x: mapObject.x, y: mapObject.y, width, height };
    return new PetAdoptionCenter(
      { id: name as InteractableID, pets: [], occupants: []},
      rect,
      townEmitter
    );
  }

  public handleCommand<CommandType extends InteractableCommand>(
    command: CommandType,
  ): InteractableCommandReturnType<CommandType> {
    if (command.type === 'PetAdoptionCenterAdopt') {
      const adopt = command as PetAdoptionCenterCommand;
      this._emitAreaChanged();
      return {} as InteractableCommandReturnType<CommandType>;
    }
    throw new InvalidParametersError('Unknown command type');
  }
}
