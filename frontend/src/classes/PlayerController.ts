import EventEmitter from 'events';
import TypedEmitter from 'typed-emitter';
import { Player as PlayerModel, PlayerLocation, Pet } from '../types/CoveyTownSocket';
export const MOVEMENT_SPEED = 175;

export type PlayerEvents = {
  movement: (newLocation: PlayerLocation) => void;
  petChange: (newPet: Pet | undefined) => void;
};

export type PlayerGameObjects = {
  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  label: Phaser.GameObjects.Text;
  locationManagedByGameScene: boolean /* For the local player, the game scene will calculate the current location, and we should NOT apply updates when we receive events */;
};
export default class PlayerController extends (EventEmitter as new () => TypedEmitter<PlayerEvents>) {
  private _location: PlayerLocation;

  private readonly _id: string;

  private readonly _userName: string;

  public gameObjects?: PlayerGameObjects;

  private _pets: Pet[] | undefined;

  constructor(id: string, userName: string, location: PlayerLocation, pets?: Pet[] | []) {
    super();
    this._id = id;
    this._userName = userName;
    this._location = location;
    this._pets = pets || [];
  }

  public adoptPet(newPet: Pet | undefined): Pet | undefined {
    console.log("Player:", this._userName, "adopts pet:", newPet);
    if (newPet) {
      if (!this._pets) {
        this._pets = [];
      }
      this._pets.push(newPet);
    } 
    return this._pets?.pop();
  }

  set location(newLocation: PlayerLocation) {
    this._location = newLocation;
    this._updateGameComponentLocation();
    this.emit('movement', newLocation);
  }

  get location(): PlayerLocation {
    return this._location;
  }

  get userName(): string {
    return this._userName;
  }

  get id(): string {
    return this._id;
  }

  set pets(pets: Pet[] | undefined) {
    if (pets) {
      if (!this._pets) {
        this._pets = [];
      }
      this._pets = [...this._pets, ...pets];
    }
    console.log("Player:", this._userName, "has pets:", this._pets);
  }

  get pets(): Pet[] | undefined {
    return this._pets;
  }

  toPlayerModel(): PlayerModel {
    return { id: this.id, userName: this.userName, location: this.location, pets: this.pets || []};
  }

  private _updateGameComponentLocation() {
    if (this.gameObjects && !this.gameObjects.locationManagedByGameScene) {
      const { sprite, label } = this.gameObjects;
      if (!sprite.anims) return;
      sprite.setX(this.location.x);
      sprite.setY(this.location.y);
      if (this.location.moving) {
        sprite.anims.play(`misa-${this.location.rotation}-walk`, true);
        switch (this.location.rotation) {
          case 'front':
            sprite.body.setVelocity(0, MOVEMENT_SPEED);
            break;
          case 'right':
            sprite.body.setVelocity(MOVEMENT_SPEED, 0);
            break;
          case 'back':
            sprite.body.setVelocity(0, -MOVEMENT_SPEED);
            break;
          case 'left':
            sprite.body.setVelocity(-MOVEMENT_SPEED, 0);
            break;
        }
        sprite.body.velocity.normalize().scale(175);
      } else {
        sprite.body.setVelocity(0, 0);
        sprite.anims.stop();
        sprite.setTexture('atlas', `misa-${this.location.rotation}`);
      }
      label.setX(sprite.body.x);
      label.setY(sprite.body.y - 20);
    }
  }

  static fromPlayerModel(modelPlayer: PlayerModel): PlayerController {
    return new PlayerController(modelPlayer.id, modelPlayer.userName, modelPlayer.location, modelPlayer.pets);
  }
}
