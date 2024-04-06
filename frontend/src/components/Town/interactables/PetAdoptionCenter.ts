import Bear from '../../../classes/Bear';
import Mouse from '../../../classes/Mouse';
import Wolf from '../../../classes/Wolf';
import PetAdoptionCenterController from '../../../classes/interactable/PetAdoptionCenterController';
import { BoundingBox, Pet, InteractableType } from '../../../types/CoveyTownSocket';
import Interactable, { KnownInteractableTypes } from '../Interactable';

export default class PetAdoptionCenter extends Interactable {
  MAX_PETS = 5;
  private _infoTextBox?: Phaser.GameObjects.Text;

  private _isInteracting = false;

  private _pets: Pet[] = [];

  private _petAdoptionCenter?: PetAdoptionCenterController;

  //private _changeListener?: PetAdoptionCenterEvents['TODO'];

  getRandomizedPets(): Pet[] {
    const pets: Pet[] = [];
    for (let i = 0; i < this.MAX_PETS; i++) {
      if (Math.random() < 0.3) {
        pets.push(new Wolf());
      } else if (Math.random() < 0.6) {
        pets.push(new Mouse());
      } else {
        pets.push(new Bear());
      }
    }
    return pets;
  }
  
  public get pets(): Pet[] {
    console.log('getting pets from frontend')
    if (!this.pets || this.pets.length === 0) {
      this._pets = this.getRandomizedPets();
    }
    return this._pets;
  }

  public set pets(pets: Pet[]) {
    this._pets = pets;
  }

  getType(): KnownInteractableTypes {
    return 'petAdoptionCenter';
  }

  removedFromScene(): void {
    super.removedFromScene();
    //this._petAdoptionCenter?.removeListener('TODO', this._changeListener);
  }

  addedToScene() {
    super.addedToScene();
    this.setTintFill();
    this.setAlpha(0.3);
    this.setDepth(-1);
    this.scene.add.text(
      this.x - this.displayWidth / 2,
      this.y + this.displayHeight / 2,
      this.name,
      { color: '#FFFFFF', backgroundColor: '#000000' },
    );
    this.pets = this.getRandomizedPets();
  }

  public getBoundingBox(): BoundingBox {
    const { x, y, width, height } = this.getBounds();
    return { x, y, width, height };
  }

  private _showInfoBox() {
    if (!this._infoTextBox) {
      this._infoTextBox = this.scene.add
        .text(
          this.scene.scale.width / 2,
          this.scene.scale.height / 2,
          "You've found the Pet Adoption Center.\nSee our friendly bunch of adoptable pets by pressing spacebar.",
          { color: '#000000', backgroundColor: '#FFFFFF' },
        )
        .setScrollFactor(0)
        .setDepth(30);
    }
    this._infoTextBox.setVisible(true);
    this._infoTextBox.x = this.scene.scale.width / 2 - this._infoTextBox.width / 2;
  }

  overlap(): void {
    this._showInfoBox();
  }

  overlapExit(): void {
    this._infoTextBox?.setVisible(false);
    if (this._isInteracting) {
      this.townController.interactableEmitter.emit('endInteraction', this);
      this._isInteracting = false;
    }
  }

  interact(): void {
    this._isInteracting = true;
  }
}
