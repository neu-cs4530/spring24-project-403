enum AccessoryType {
  HAT = 'hat',
  COLLAR = 'collar',
  GLASSES = 'glasses',
}

export default class Accessory {
  private readonly _type: AccessoryType;

  private readonly _color: string;

  constructor(type: AccessoryType, color: string) {
    this._type = type;
    this._color = color;
  }
}
