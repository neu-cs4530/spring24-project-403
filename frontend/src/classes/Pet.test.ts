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
    expect(pet.petType).toBe('bear');
    expect(pet.makeSound()).toBe('Grrrr!');
  });
  it('should create a new bear with a specific name, id, and color', () => {
    const pet = new Bear('Yogi', '123', 'brown');
    expect(pet.name).toBe('Yogi');
    expect(pet.ownerId).toBe('123');
    expect(pet.color).toBe('brown');
    expect(pet.petType).toBe('bear');
    expect(pet.makeSound()).toBe('Grrrr!');
  });
  it('should create a new mouse with a random id and random color', () => {
    const pet = new Mouse(undefined, undefined, undefined);
    expect(pet.id).toBeDefined();
    expect(pet.name).toBeUndefined();
    expect(pet.ownerId).toBeUndefined();
    expect(Mouse.mouseColors).toContain(pet.color);
    expect(pet.petType).toBe('mouse');
    expect(pet.makeSound()).toBe('Squeak!');
  });
  it('should create a new mouse with a specific name, id, and color', () => {
    const pet = new Mouse('Stuart', '123', 'white');
    expect(pet.name).toBe('Stuart');
    expect(pet.ownerId).toBe('123');
    expect(pet.color).toBe('white');
    expect(pet.petType).toBe('mouse');
    expect(pet.makeSound()).toBe('Squeak!');
  });
  it('should create a new wolf with a random id and random color', () => {
    const pet = new Wolf(undefined, undefined, undefined);
    expect(pet.id).toBeDefined();
    expect(pet.name).toBeUndefined();
    expect(pet.ownerId).toBeUndefined();
    expect(Wolf.wolfColors).toContain(pet.color);
    expect(pet.petType).toBe('wolf');
    expect(pet.makeSound()).toBe('Awooo!');
  });
  it('should create a new wolf with a specific name, id, and color', () => {
    const pet = new Wolf('Blaidd', '123', 'grey');
    expect(pet.id).toBeDefined();
    expect(pet.name).toBe('Blaidd');
    expect(pet.ownerId).toBe('123');
    expect(pet.color).toBe('grey');
    expect(pet.petType).toBe('wolf');
    expect(pet.makeSound()).toBe('Awooo!');
  });
  it('should throw an error when creating a new bear with invalid constructor arguments', () => {
    expect(() => new Bear('Yogi', '123', undefined)).toThrowError(
      'Invalid constructor arguments for Bear object',
    );
  });
  it('should throw an error when creating a new mouse with invalid constructor arguments', () => {
    expect(() => new Mouse('Stuart', undefined, 'white')).toThrowError(
      'Invalid constructor arguments for Mouse object',
    );
  });
  it('should throw an error when creating a new wolf with invalid constructor arguments', () => {
    expect(() => new Wolf(undefined, '123', 'grey')).toThrowError(
      'Invalid constructor arguments for Wolf object',
    );
  });
});
