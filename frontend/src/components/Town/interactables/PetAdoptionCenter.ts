import PetAdoptionCenterController, {
    PetAdoptionCenterEvents,
  } from '../../../classes/interactable/PetAdoptionCenterController';
  import { BoundingBox } from '../../../types/CoveyTownSocket';
  import Interactable, { KnownInteractableTypes } from '../Interactable';
    import BasePet from '../../../../../townService/src/lib/BasePet';
  
  export default class PetAdoptionCenter extends Interactable {
    private _infoTextBox?: Phaser.GameObjects.Text;

    private _petAdoptionCenter?: PetAdoptionCenterController;
  
    //private _changeListener?: PetAdoptionCenterEvents['TODO'];

    // May end up having interface for pets instead of BasePet
    private _pets: BasePet[] = [];

    getPets(): BasePet[] {
        return this._pets;
    }
  
    getType(): KnownInteractableTypes {
      return 'petAdoptionCenter';
    }
  
    removedFromScene(): void {
        super.removedFromScene();
        //this._petAdoptionCenter?.removeListener('TODO', this._changeListener);
    }
  
    addedToScene(): void {
      super.addedToScene();
      this.setTintFill();
      this.setAlpha(0.3);
      this.scene.add.text(
        this.x - this.displayWidth / 2,
        this.y - this.displayHeight / 2,
        this.name,
        { color: '#FFFFFF', backgroundColor: '#000000' },
      );
      this._petAdoptionCenter = this.townController.getPetAdoptionCenterController(this);
      //this._changeListener = newTopic => this._updateLabelText(newTopic);
      //this._conversationArea.addListener('topicChange', this._changeListener);
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
            "You've found the Pet Adoption Center. A wonderful place where you'll find lifelong companions.\nCome on in and find your best buddy.\nSee our friendly bunch of adoptable pets by pressing spacebar.",
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
    }
  }
  