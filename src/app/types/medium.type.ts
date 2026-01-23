export enum MediumType {
  Movie = 'movie',
  Book = 'book',
  Music = 'music'
}

export function isMediumType(value: string): value is MediumType {
  return Object.values(MediumType).includes(value as MediumType);
}