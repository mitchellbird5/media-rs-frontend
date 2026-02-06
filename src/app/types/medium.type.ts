
export enum MediumType {
  Movies = 'movies',
  Books = 'books',
  Music = 'music'
}

export function isMediumType(value: string): value is MediumType {
  return Object.values(MediumType).includes(value as MediumType);
}