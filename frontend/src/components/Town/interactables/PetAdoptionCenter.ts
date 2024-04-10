import { BoundingBox } from '../../../types/CoveyTownSocket';
import Interactable, { KnownInteractableTypes } from '../Interactable';

/**
 * A class representing the Pet Adoption Center
 */
export default class PetAdoptionCenter extends Interactable {
  private _infoTextBox?: Phaser.GameObjects.Text;

  private _isInteracting = false;

  /**
   * The type of the interactable
   * @returns the type of the interactable
   */
  getType(): KnownInteractableTypes {
    return 'petAdoptionCenter';
  }

  /**
   * Called when the interactable is removed from the scene
   */
  removedFromScene(): void {
    super.removedFromScene();
  }

  /**
   * Called when the interactable is added to the scene
   */
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
  }

  /**
   * The bounding box of the interactable
   * @returns the bounding box of the interactable
   */
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

  /**
   * Called when the interactable overlaps with the player
   */
  overlap(): void {
    this._showInfoBox();
  }

  /**
   * Called when the interactable stops overlapping with the player
   */
  overlapExit(): void {
    this._infoTextBox?.setVisible(false);
    if (this._isInteracting) {
      this.townController.interactableEmitter.emit('endInteraction', this);
      this._isInteracting = false;
    }
  }

  /**
   * Called when the player interacts with the interactable
   */
  interact(): void {
    this._isInteracting = true;
  }
}
