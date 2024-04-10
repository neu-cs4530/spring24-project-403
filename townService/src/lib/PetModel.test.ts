import { nanoid } from 'nanoid';
import BearModel from './BearModel';
import MouseModel from './MouseModel';
import WolfModel from './WolfModel';

describe('BasePet', () => {
  it('should create a new bear with a random id', () => {
    const pet = new BearModel(nanoid());
    expect(pet.id).toBeDefined();
    expect(pet.name).toBeUndefined();
    expect(pet.ownerId).toBeUndefined();
    expect(pet.color).toBeUndefined();
    expect(pet.petType).toBe('bear');
  });
  it('should create a new bear with a specific name, id, and color', () => {
    const pet = new BearModel(nanoid(), 'Yogi', '123', 'brown');
    expect(pet.id).toBeDefined();
    expect(pet.name).toBe('Yogi');
    expect(pet.ownerId).toBe('123');
    expect(pet.color).toBe('brown');
    expect(pet.petType).toBe('bear');
  });
  it('should create a new mouse with a random id', () => {
    const pet = new MouseModel(nanoid());
    expect(pet.id).toBeDefined();
    expect(pet.name).toBeUndefined();
    expect(pet.ownerId).toBeUndefined();
    expect(pet.color).toBeUndefined();
    expect(pet.petType).toBe('mouse');
  });
  it('should create a new mouse with a specific name, id, and color', () => {
    const pet = new MouseModel(nanoid(), 'Stuart', '123', 'white');
    expect(pet.id).toBeDefined();
    expect(pet.name).toBe('Stuart');
    expect(pet.ownerId).toBe('123');
    expect(pet.color).toBe('white');
    expect(pet.petType).toBe('mouse');
  });
  it('should create a new wolf with a random id and random color', () => {
    const pet = new WolfModel(nanoid(), undefined, undefined, undefined);
    expect(pet.id).toBeDefined();
    expect(pet.name).toBeUndefined();
    expect(pet.ownerId).toBeUndefined();
    expect(pet.color).toBeUndefined();
    expect(pet.petType).toBe('wolf');
  });
  it('should create a new wolf with a specific name, id, and color', () => {
    const pet = new WolfModel(nanoid(), 'Blaidd', '123', 'grey');
    expect(pet.id).toBeDefined();
    expect(pet.name).toBe('Blaidd');
    expect(pet.ownerId).toBe('123');
    expect(pet.color).toBe('grey');
    expect(pet.petType).toBe('wolf');
  });
});
