import { ITiledMapObject } from '@jonbell/tiled-map-type-guard';
import { nanoid } from 'nanoid';
import BearModel from '../lib/BearModel';
import InvalidParametersError from '../lib/InvalidParametersError';
import MouseModel from '../lib/MouseModel';
import Player from '../lib/Player';
import WolfModel from '../lib/WolfModel';
import {
  BearColor,
  BoundingBox,
  InteractableCommand,
  InteractableCommandReturnType,
  InteractableID,
  MouseColor,
  Pet,
  PetAdoptionCenter as PetAdoptionCenterModel,
  TownEmitter,
  WolfColor,
} from '../types/CoveyTownSocket';
import InteractableArea from './InteractableArea';

export default class PetAdoptionCenter extends InteractableArea {
  MAX_PETS = 5;

  TYPES_OF_PETS = 3;

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

  /**
   * Removes a pet from the pet adoption center area and replaces it with a new one.
   * @param petData the pet to remove
   */
  public removePet(petData: Pet) {
    this._pets = this._pets.filter(pet => pet.id !== petData.id);
    // replace the pet with a new one
    while (this._pets.length < this.MAX_PETS) {
      this._pets.push(this.getRandomizedPets()[0]);
    }
    this._emitAreaChanged();
  }

  private getRandomizedPets(): Pet[] {
    const pets: Pet[] = [];
    const bearColors: BearColor[] = ['black', 'brown'];
    const mouseColors: MouseColor[] = ['white', 'brown', 'grey'];
    const wolfColors: WolfColor[] = ['grey', 'brown'];

    for (let i = 0; i < this.MAX_PETS; i++) {
      const bearColor = bearColors[Math.floor(Math.random() * bearColors.length)];
      const mouseColor = mouseColors[Math.floor(Math.random() * mouseColors.length)];
      const wolfColor = wolfColors[Math.floor(Math.random() * wolfColors.length)];
      const petType = Math.floor(Math.random() * this.TYPES_OF_PETS);

      if (petType === 0) {
        pets.push(new WolfModel(nanoid(), undefined, undefined, wolfColor).toPetModel()); // Assuming constructor modification for color
      } else if (petType === 1) {
        pets.push(new MouseModel(nanoid(), undefined, undefined, mouseColor).toPetModel()); // Assuming constructor modification for color
      } else {
        pets.push(new BearModel(nanoid(), undefined, undefined, bearColor).toPetModel()); // Assuming constructor modification for color
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

  /**
   * Adds a player to this pet adoption center area.
   */
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
      { id: name as InteractableID, pets: [], occupants: [] },
      rect,
      townEmitter,
    );
  }

  /**
   * Handles a command from a player in this pet adoption center area.
   */
  public handleCommand<
    CommandType extends InteractableCommand,
  >(): InteractableCommandReturnType<CommandType> {
    throw new InvalidParametersError('Unknown command type');
  }
}
