import assert from 'assert';
import Phaser from 'phaser';
import PlayerController, { MOVEMENT_SPEED } from '../../classes/PlayerController';
import TownController from '../../classes/TownController';
import { PlayerLocation } from '../../types/CoveyTownSocket';
import { Callback } from '../VideoCall/VideoFrontend/types';
import Interactable from './Interactable';
import ConversationArea from './interactables/ConversationArea';
import GameArea from './interactables/GameArea';
import Transporter from './interactables/Transporter';
import ViewingArea from './interactables/ViewingArea';
import PetAdoptionCenter from './interactables/PetAdoptionCenter';
const PET_OFFSET = 30;

// Still not sure what the right type is here... "Interactable" doesn't do it
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function interactableTypeForObjectType(type: string): any {
  if (type === 'ConversationArea') {
    return ConversationArea;
  } else if (type === 'Transporter') {
    return Transporter;
  } else if (type === 'ViewingArea') {
    return ViewingArea;
  } else if (type === 'GameArea') {
    return GameArea;
  } else if (type === 'PetAdoptionCenter') {
    return PetAdoptionCenter;
  } else {
    throw new Error(`Unknown object type: ${type}`);
  }
}

// Original inspiration and code from:
// https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-1-958fc7e6bbd6
export default class TownGameScene extends Phaser.Scene {
  private _pendingOverlapExits = new Map<Interactable, () => void>();

  addOverlapExit(interactable: Interactable, callback: () => void) {
    this._pendingOverlapExits.set(interactable, callback);
  }

  private _players: PlayerController[] = [];

  private _interactables: Interactable[] = [];

  private _cursors: Phaser.Types.Input.Keyboard.CursorKeys[] = [];

  private _cursorKeys?: Phaser.Types.Input.Keyboard.CursorKeys;

  /*
   * A "captured" key doesn't send events to the browser - they are trapped by Phaser
   * When pausing the game, we uncapture all keys, and when resuming, we re-capture them.
   * This is the list of keys that are currently captured by Phaser.
   */
  private _previouslyCapturedKeys: number[] = [];

  private _lastLocation?: PlayerLocation;

  private _ready = false;

  private _paused = false;

  private _movementAllowed = true;

  public coveyTownController: TownController;

  private _onGameReadyListeners: Callback[] = [];

  /**
   * Layers that the player can collide with.
   */
  private _collidingLayers: Phaser.Tilemaps.TilemapLayer[] = [];

  private _gameIsReady = new Promise<void>(resolve => {
    if (this._ready) {
      resolve();
    } else {
      this._onGameReadyListeners.push(resolve);
    }
  });

  public get gameIsReady() {
    return this._gameIsReady;
  }

  public get cursorKeys() {
    const ret = this._cursorKeys;
    if (!ret) {
      throw new Error('Unable to access cursors before game scene is loaded');
    }
    return ret;
  }

  private _resourcePathPrefix: string;

  constructor(coveyTownController: TownController, resourcePathPrefix = '') {
    super('TownGameScene');
    this._resourcePathPrefix = resourcePathPrefix;
    this.coveyTownController = coveyTownController;
    this._players = this.coveyTownController.players;
  }

  preload() {
    this.load.image(
      'Room_Builder_32x32',
      this._resourcePathPrefix + '/assets/tilesets/Room_Builder_32x32.png',
    );
    this.load.image(
      '22_Museum_32x32',
      this._resourcePathPrefix + '/assets/tilesets/22_Museum_32x32.png',
    );
    this.load.image(
      '23_Pets_32x32',
      this._resourcePathPrefix + '/assets/tilesets/23_Pets_32x32.png',
    );
    this.load.image(
      '24_Accessories_32x32',
      this._resourcePathPrefix + '/assets/tilesets/24_Accessories_32x32.png',
    );
    this.load.image(
      '5_Classroom_and_library_32x32',
      this._resourcePathPrefix + '/assets/tilesets/5_Classroom_and_library_32x32.png',
    );
    this.load.image(
      '12_Kitchen_32x32',
      this._resourcePathPrefix + '/assets/tilesets/12_Kitchen_32x32.png',
    );
    this.load.image(
      '1_Generic_32x32',
      this._resourcePathPrefix + '/assets/tilesets/1_Generic_32x32.png',
    );
    this.load.image(
      '13_Conference_Hall_32x32',
      this._resourcePathPrefix + '/assets/tilesets/13_Conference_Hall_32x32.png',
    );
    this.load.image(
      '14_Basement_32x32',
      this._resourcePathPrefix + '/assets/tilesets/14_Basement_32x32.png',
    );
    this.load.image(
      '16_Grocery_store_32x32',
      this._resourcePathPrefix + '/assets/tilesets/16_Grocery_store_32x32.png',
    );
    this.load.tilemapTiledJSON('map', this._resourcePathPrefix + '/assets/tilemaps/indoors.json');
    this.load.atlas(
      'atlas',
      this._resourcePathPrefix + '/assets/atlas/atlas.png',
      this._resourcePathPrefix + '/assets/atlas/atlas.json',
    );
  }

  updatePlayers(players: PlayerController[]) {
    //Make sure that each player has sprites
    players.map(eachPlayer => this.createPlayerSprites(eachPlayer));
    players.map(eachPlayer => this.createPetSprite(eachPlayer));

    // Remove disconnected players from board
    const disconnectedPlayers = this._players.filter(
      player => !players.find(p => p.id === player.id),
    );

    disconnectedPlayers.forEach(disconnectedPlayer => {
      if (disconnectedPlayer.gameObjects) {
        const { sprite, label } = disconnectedPlayer.gameObjects;
        if (sprite && label) {
          sprite.destroy();
          label.destroy();
        }
        if (disconnectedPlayer.activePet) {
          const { petSprite, petLabel } = disconnectedPlayer.activePet;
          if (petSprite && petLabel) {
            petSprite.destroy();
            petLabel.destroy();
          }
        }
      }
    });
    // Remove disconnected players from list
    this._players = players;
  }

  getNewMovementDirection() {
    if (this._cursors.find(keySet => keySet.left?.isDown)) {
      return 'left';
    }
    if (this._cursors.find(keySet => keySet.right?.isDown)) {
      return 'right';
    }
    if (this._cursors.find(keySet => keySet.down?.isDown)) {
      return 'front';
    }
    if (this._cursors.find(keySet => keySet.up?.isDown)) {
      return 'back';
    }
    return undefined;
  }

  moveOurPlayerTo(destination: Partial<PlayerLocation>) {
    const gameObjects = this.coveyTownController.ourPlayer.gameObjects;
    console.log('moving player');
    const pet = this.coveyTownController.ourPlayer.activePet;
    if (!gameObjects) {
      throw new Error('Unable to move player without game objects created first');
    }
    if (!this._movementAllowed) {
      return;
    }
    if (!this._lastLocation) {
      this._lastLocation = { moving: false, rotation: 'front', x: 0, y: 0 };
    }
    if (destination.x !== undefined) {
      gameObjects.sprite.x = destination.x;
      this._lastLocation.x = destination.x;
      if (pet) {
        const direction = this.getNewMovementDirection();
        switch (direction) {
          case 'left':
            pet.petSprite.x = gameObjects.sprite.x - PET_OFFSET;
            console.log('moving pet left');
            break;
          case 'right':
            pet.petSprite.x = gameObjects.sprite.x + PET_OFFSET;
            console.log('moving pet right');
            break;
          default:
            break;
        }
      }
    }
    if (destination.y !== undefined) {
      gameObjects.sprite.y = destination.y;
      this._lastLocation.y = destination.y;
      if (pet) {
        const direction = this.getNewMovementDirection();
        switch (direction) {
          case 'back':
            pet.petSprite.y = gameObjects.sprite.y - PET_OFFSET;
            console.log('moving pet back');
            break;
          case 'front':
            pet.petSprite.y = gameObjects.sprite.y + PET_OFFSET;
            console.log('moving pet front');
            break;
          default:
            break;
        }
      }
    }
    if (destination.moving !== undefined) {
      this._lastLocation.moving = destination.moving;
    }
    if (destination.rotation !== undefined) {
      this._lastLocation.rotation = destination.rotation;
    }
    this.coveyTownController.emitMovement(this._lastLocation);
  }

  stopPlayerAndPetMovement() {
    //  TODO: this only sets the velocity to 0 for a lttle bit?
    // also set collide() to true?
    const gameObjects = this.coveyTownController.ourPlayer.gameObjects;
    const pet = this.coveyTownController.ourPlayer.activePet;
    console.log('stopping player and pet movement');
    if (gameObjects) {
      gameObjects.sprite.body.setVelocity(0);
      gameObjects.sprite.anims.stop();
      console.log('stopped player movement');
    }
    if (pet) {
      pet.petSprite.body.setVelocity(0);
      pet.petSprite.anims.stop();
      console.log('stopped pet movement');
    }
    this._movementAllowed = false;
  }

  updateSprite(
    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    label: Phaser.GameObjects.Text,
    pet = false,
  ) {
    const prevVelocity = sprite.body.velocity.clone();
    const body = sprite.body as Phaser.Physics.Arcade.Body;

    if (pet) {
      console.log('updating pet sprite');
    } else {
      console.log('updating player sprite');
    }

    // Stop any previous movement from the last frame
    body.setVelocity(0);

    const primaryDirection = this.getNewMovementDirection();
    // add pet here, using another misa sprite as a placeholder for now
    switch (primaryDirection) {
      case 'left':
        body.setVelocityX(-MOVEMENT_SPEED);
        sprite.anims.play('misa-left-walk', true);
        if (pet) {
          console.log('pet velocity mobig left');
        } else {
          console.log('player velocity moving left');
        }
        break;
      case 'right':
        body.setVelocityX(MOVEMENT_SPEED);
        sprite.anims.play('misa-right-walk', true);
        if (pet) {
          console.log('pet velocity moving right');
        } else {
          console.log('player velocity moving right');
        }
        break;
      case 'front':
        body.setVelocityY(MOVEMENT_SPEED);
        sprite.anims.play('misa-front-walk', true);
        if (pet) {
          console.log('pet velocity moving front');
        } else {
          console.log('player velocity moving front');
        }
        break;
      case 'back':
        body.setVelocityY(-MOVEMENT_SPEED);
        sprite.anims.play('misa-back-walk', true);
        if (pet) {
          console.log('pet velocity moving back');
        } else {
          console.log('player velocity moving back');
        }
        break;
      default:
        // Not moving
        // stop pet too
        sprite.anims.stop();
        // If we were moving, pick and idle frame to use
        // add pet idle frame here
        if (prevVelocity.x < 0) {
          sprite.setTexture('atlas', 'misa-left');
        } else if (prevVelocity.x > 0) {
          sprite.setTexture('atlas', 'misa-right');
        } else if (prevVelocity.y < 0) {
          sprite.setTexture('atlas', 'misa-back');
        } else if (prevVelocity.y > 0) {
          sprite.setTexture('atlas', 'misa-front');
        }
        break;
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    sprite.body.velocity.normalize().scale(MOVEMENT_SPEED);

    // const isMoving = primaryDirection !== undefined;
    label.setX(body.x);
    label.setY(body.y - 20);
    // const x = sprite.getBounds().centerX;
    // const y = sprite.getBounds().centerY;
  }

  update() {
    // abstract into update sprite function
    if (this._paused || !this._movementAllowed) {
      return;
    }
    const gameObjects = this.coveyTownController.ourPlayer.gameObjects;
    const pet = this.coveyTownController.ourPlayer.activePet;
    // update active pet here?
    if (gameObjects && this._cursors) {
      this.updateSprite(gameObjects.sprite, gameObjects.label);
      if (pet) {
        this.updateSprite(pet.petSprite, pet.petLabel, true);
      }

      const primaryDirection = this.getNewMovementDirection();
      const isMoving = primaryDirection !== undefined;
      const x = gameObjects.sprite.getBounds().centerX;
      const y = gameObjects.sprite.getBounds().centerY;

      //Move the sprite
      // update pet sprite location here
      if (
        !this._lastLocation ||
        (isMoving && this._lastLocation.rotation !== primaryDirection) ||
        this._lastLocation.moving !== isMoving
      ) {
        if (!this._lastLocation) {
          this._lastLocation = {
            x,
            y,
            rotation: primaryDirection || 'front',
            moving: isMoving,
          };
        }
        this._lastLocation.x = x;
        this._lastLocation.y = y;
        this._lastLocation.rotation = primaryDirection || this._lastLocation.rotation || 'front';
        this._lastLocation.moving = isMoving;
        this._pendingOverlapExits.forEach((cb, interactable) => {
          if (
            !Phaser.Geom.Rectangle.Overlaps(
              interactable.getBounds(),
              gameObjects.sprite.getBounds(),
            )
          ) {
            this._pendingOverlapExits.delete(interactable);
            cb();
          }
        });
        this.coveyTownController.emitMovement(this._lastLocation);
      }
      //Update the location for the labels of all of the other players
      for (const player of this._players) {
        if (player.gameObjects?.label && player.gameObjects?.sprite.body) {
          player.gameObjects.label.setX(player.gameObjects.sprite.body.x);
          player.gameObjects.label.setY(player.gameObjects.sprite.body.y - 20);

          if (player.activePet) {
            player.activePet.petLabel.setX(player.activePet.petSprite.body.x);
            player.activePet.petLabel.setY(player.activePet.petSprite.body.y - 20);
          }
        }
      }
    }
  }

  private _map?: Phaser.Tilemaps.Tilemap;

  public get map(): Phaser.Tilemaps.Tilemap {
    const map = this._map;
    if (!map) {
      throw new Error('Cannot access map before it is initialized');
    }
    return map;
  }

  getInteractables(): Interactable[] {
    const typedObjects = this.map.filterObjects('Objects', obj => obj.type !== '');
    assert(typedObjects);
    const gameObjects = this.map.createFromObjects(
      'Objects',
      typedObjects.map(obj => ({
        id: obj.id,
        classType: interactableTypeForObjectType(obj.type),
      })),
    );

    return gameObjects as Interactable[];
  }

  create() {
    this._map = this.make.tilemap({ key: 'map' });

    /* Parameters are the name you gave the tileset in Tiled and then the key of the
         tileset image in Phaser's cache (i.e. the name you used in preload)
         */
    const tileset = [
      'Room_Builder_32x32',
      '22_Museum_32x32',
      '23_Pets_32x32',
      '24_Accessories_32x32',
      '5_Classroom_and_library_32x32',
      '12_Kitchen_32x32',
      '1_Generic_32x32',
      '13_Conference_Hall_32x32',
      '14_Basement_32x32',
      '16_Grocery_store_32x32',
    ].map(v => {
      const ret = this.map.addTilesetImage(v);
      assert(ret);
      return ret;
    });

    this._collidingLayers = [];
    // Parameters: layer name (or index) from Tiled, tileset, x, y
    const belowLayer = this.map.createLayer('Below Player', tileset, 0, 0);
    assert(belowLayer);
    belowLayer.setDepth(-10);
    const wallsLayer = this.map.createLayer('Walls', tileset, 0, 0);
    const onTheWallsLayer = this.map.createLayer('On The Walls', tileset, 0, 0);
    assert(wallsLayer);
    assert(onTheWallsLayer);
    wallsLayer.setCollisionByProperty({ collides: true });
    onTheWallsLayer.setCollisionByProperty({ collides: true });

    const worldLayer = this.map.createLayer('World', tileset, 0, 0);
    assert(worldLayer);
    worldLayer.setCollisionByProperty({ collides: true });
    const aboveLayer = this.map.createLayer('Above Player', tileset, 0, 0);
    assert(aboveLayer);
    aboveLayer.setCollisionByProperty({ collides: true });

    const veryAboveLayer = this.map.createLayer('Very Above Player', tileset, 0, 0);
    assert(veryAboveLayer);
    /* By default, everything gets depth sorted on the screen in the order we created things.
         Here, we want the "Above Player" layer to sit on top of the player, so we explicitly give
         it a depth. Higher depths will sit on top of lower depth objects.
         */
    worldLayer.setDepth(5);
    aboveLayer.setDepth(10);
    veryAboveLayer.setDepth(15);

    // Make collison group of players and pets
    const playerAndPetGroup = this.physics.add.group();

    // Object layers in Tiled let you embed extra info into a map - like a spawn point or custom
    // collision shapes. In the tmx file, there's an object layer with a point named "Spawn Point"
    const spawnPoint = this.map.findObject(
      'Objects',
      obj => obj.name === 'Spawn Point',
    ) as unknown as Phaser.GameObjects.Components.Transform;

    const labels = this.map.filterObjects('Objects', obj => obj.name === 'label');
    labels?.forEach(label => {
      if (label.x && label.y) {
        this.add.text(label.x, label.y, label.text.text, {
          color: '#FFFFFF',
          backgroundColor: '#000000',
        });
      }
    });
    assert(this.input.keyboard);
    this._cursorKeys = this.input.keyboard.createCursorKeys();
    this._cursors.push(this._cursorKeys);
    this._cursors.push(
      this.input.keyboard.addKeys(
        {
          up: Phaser.Input.Keyboard.KeyCodes.W,
          down: Phaser.Input.Keyboard.KeyCodes.S,
          left: Phaser.Input.Keyboard.KeyCodes.A,
          right: Phaser.Input.Keyboard.KeyCodes.D,
        },
        false,
      ) as Phaser.Types.Input.Keyboard.CursorKeys,
    );
    this._cursors.push(
      this.input.keyboard.addKeys(
        {
          up: Phaser.Input.Keyboard.KeyCodes.H,
          down: Phaser.Input.Keyboard.KeyCodes.J,
          left: Phaser.Input.Keyboard.KeyCodes.K,
          right: Phaser.Input.Keyboard.KeyCodes.L,
        },
        false,
      ) as Phaser.Types.Input.Keyboard.CursorKeys,
    );

    // Create a sprite with physics enabled via the physics system. The image used for the sprite
    // has a bit of whitespace, so I'm using setSize & setOffset to control the size of the
    // player's body.
    const sprite = this.physics.add
      .sprite(spawnPoint.x, spawnPoint.y, 'atlas', 'misa-front')
      .setSize(30, 40)
      .setOffset(0, 24)
      .setDepth(6);
    const label = this.add
      .text(spawnPoint.x, spawnPoint.y - 20, '(You)', {
        font: '18px monospace',
        color: '#000000',
        // padding: {x: 20, y: 10},
        backgroundColor: '#ffffff',
      })
      .setDepth(6);
    this.coveyTownController.ourPlayer.gameObjects = {
      sprite,
      label,
      locationManagedByGameScene: true,
    };
    // set on collide? to tell pet sprite to stop?

    this._interactables = this.getInteractables();

    this.moveOurPlayerTo({ rotation: 'front', moving: false, x: spawnPoint.x, y: spawnPoint.y });

    // Watch the player and worldLayer for collisions, for the duration of the scene:
    this._collidingLayers.push(worldLayer);
    this._collidingLayers.push(wallsLayer);
    this._collidingLayers.push(aboveLayer);
    this._collidingLayers.push(onTheWallsLayer);
    this._collidingLayers.forEach(layer =>
      this.physics.add.collider(sprite, layer, this.stopPlayerAndPetMovement, undefined, this),
    );

    const pet = this.coveyTownController.ourPlayer.activePet;
    if (pet) {
      // create pet sprite here
      const petSprite = this.physics.add
        .sprite(spawnPoint.x, spawnPoint.y - PET_OFFSET, 'atlas', 'misa-front')
        .setSize(32, 32)
        .setOffset(0, 24)
        .setDepth(5);
      const petLabel = this.add
        .text(spawnPoint.x, spawnPoint.y - PET_OFFSET - 20, pet.name, {
          font: '18px monospace',
          color: '#000000',
          // padding: {x: 20, y: 10},
          backgroundColor: '#ffffff',
        })
        .setDepth(5);
      this.coveyTownController.ourPlayer.activePet = {
        ...pet,
        petSprite: petSprite,
        petLabel: petLabel,
      };
      this._collidingLayers.forEach(layer => {
        this.physics.add.collider(
          [sprite, petSprite],
          layer,
          this.stopPlayerAndPetMovement,
          undefined,
          this,
        );
        // this.physics.add.collider(sprite, layer, this.stopPlayerAndPetMovement, undefined, this);
      });
    }

    // Create the player's walking animations from the texture atlas. These are stored in the global
    // animation manager so any sprite can access them.
    const { anims } = this;
    anims.create({
      key: 'misa-left-walk',
      frames: anims.generateFrameNames('atlas', {
        prefix: 'misa-left-walk.',
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: 'misa-right-walk',
      frames: anims.generateFrameNames('atlas', {
        prefix: 'misa-right-walk.',
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: 'misa-front-walk',
      frames: anims.generateFrameNames('atlas', {
        prefix: 'misa-front-walk.',
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: 'misa-back-walk',
      frames: anims.generateFrameNames('atlas', {
        prefix: 'misa-back-walk.',
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // TODO: creat pet walk cycles
    // anims.create({
    //   key: `${pettype}-${color}-front-walk`,
    //   frames: anims.generateFrameNames('23_Pets_32x32', {
    //     prefix: `${pettype}-${color}-front-walk.`,
    //     start: 0,
    //     end: 3,
    //     zeroPad: 3,
    //   }),
    //   frameRate: 10,
    //   repeat: -1,
    // });

    const camera = this.cameras.main;
    camera.startFollow(this.coveyTownController.ourPlayer.gameObjects.sprite);
    camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

    // Help text that has a "fixed" position on the screen
    this.add
      .text(16, 16, `Arrow keys to move`, {
        font: '18px monospace',
        color: '#000000',
        padding: {
          x: 20,
          y: 10,
        },
        backgroundColor: '#ffffff',
      })
      .setScrollFactor(0)
      .setDepth(30);

    this._ready = true;
    this.updatePlayers(this.coveyTownController.players);
    // Call any listeners that are waiting for the game to be initialized
    this._onGameReadyListeners.forEach(listener => listener());
    this._onGameReadyListeners = [];
    this.coveyTownController.addListener('playersChanged', players => this.updatePlayers(players));
  }

  createPlayerSprites(player: PlayerController) {
    if (!player.gameObjects) {
      const sprite = this.physics.add
        .sprite(player.location.x, player.location.y, 'atlas', 'misa-front')
        .setSize(30, 40)
        .setOffset(0, 24);
      const label = this.add.text(
        player.location.x,
        player.location.y - 20,
        player === this.coveyTownController.ourPlayer ? '(You)' : player.userName,
        {
          font: '18px monospace',
          color: '#000000',
          // padding: {x: 20, y: 10},
          backgroundColor: '#ffffff',
        },
      );
      player.gameObjects = {
        sprite,
        label,
        locationManagedByGameScene: false,
      };
      this._collidingLayers.forEach(layer =>
        this.physics.add.collider(sprite, layer, this.stopPlayerAndPetMovement, undefined, this),
      );
    }
  }

  createPetSprite(player: PlayerController) {
    // need to call this again when active pet changes?
    // For active pet
    if (player.activePet && !player.activePet.petSprite) {
      // depending on type, add pet sprite
      const sprite = this.physics.add
        // draw front facing pet sprite behind player sprite
        .sprite(player.location.x, player.location.y - PET_OFFSET, 'atlas', 'misa-front')
        .setSize(32, 32)
        .setOffset(0, 24);
      const label = this.add.text(
        player.location.x,
        player.location.y - PET_OFFSET - 20,
        player.activePet.name,
        {
          font: '18px monospace',
          color: '#000000',
          padding: { x: 5, y: 0 },
          backgroundColor: '#ffffff',
        },
      );
      player.activePet = {
        ...player.activePet,
        petSprite: sprite,
        petLabel: label,
      };
      this._collidingLayers.forEach(layer =>
        this.physics.add.collider(sprite, layer, this.stopPlayerAndPetMovement, undefined, this),
      );
    }
  }

  pause() {
    if (!this._paused) {
      this._paused = true;
      const gameObjects = this.coveyTownController.ourPlayer.gameObjects;
      if (gameObjects) {
        gameObjects.sprite.anims.stop();
        const body = gameObjects.sprite.body as Phaser.Physics.Arcade.Body;
        body.setVelocity(0);
      }
      const pet = this.coveyTownController.ourPlayer.activePet;
      if (pet) {
        pet.petSprite.anims.stop();
        const body = pet.petSprite.body as Phaser.Physics.Arcade.Body;
        body.setVelocity(0);
      }
      assert(this.input.keyboard);
      this._previouslyCapturedKeys = this.input.keyboard.getCaptures();
      this.input.keyboard.clearCaptures();
    }
  }

  resume() {
    if (this._paused) {
      this._paused = false;
      if (this.input && this.input.keyboard) {
        this.input.keyboard.addCapture(this._previouslyCapturedKeys);
      }
      this._previouslyCapturedKeys = [];
    }
  }
}
