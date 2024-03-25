import { nanoid } from 'nanoid';
import Bear from './Bear';
import Mouse from './Mouse';
import Wolf from './Wolf';

describe('BasePet', () => {
  it('should create a new bear with a random id and random color', () => {
    const pet = new Bear(undefined, undefined, undefined);
    expect(pet.id).toBeDefined();
    expect(pet.name).toBeUndefined();
    expect(pet.ownerId).toBeUndefined();
    expect(Bear.bearColors).toContain(pet.color);
  });
  it('should create a new bear with a specific name, id, and color', () => {
    const pet = new Bear('Yogi', '123', 'brown');
    expect(pet.name).toBe('Yogi');
    expect(pet.ownerId).toBe('123');
    expect(pet.color).toBe('brown');
  });
  it('should create a new mouse with a random id and random color', () => {
    const pet = new Mouse(undefined, undefined, undefined);
    expect(pet.id).toBeDefined();
    expect(pet.name).toBeUndefined();
    expect(pet.ownerId).toBeUndefined();
    expect(Mouse.mouseColors).toContain(pet.color);
  });
  it('should create a new mouse with a specific name, id, and color', () => {
    const pet = new Mouse('Stuart', '123', 'white');
    expect(pet.name).toBe('Stuart');
    expect(pet.ownerId).toBe('123');
    expect(pet.color).toBe('white');
  });
  it('should create a new wolf with a random id and random color', () => {
    const pet = new Wolf(undefined, undefined, undefined);
    expect(pet.id).toBeDefined();
    expect(pet.name).toBeUndefined();
    expect(pet.ownerId).toBeUndefined();
    expect(Wolf.wolfColors).toContain(pet.color);
  });
  it('should create a new wolf with a specific name, id, and color', () => {
    const pet = new Wolf('Blaidd', '123', 'grey');
    expect(pet.id).toBeDefined();
    expect(pet.name).toBe('Blaidd');
    expect(pet.ownerId).toBe('123');
    expect(pet.color).toBe('grey');
  });
});
