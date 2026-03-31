export const DEFAULT_DICTIONARY = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
] as const;

export type DictionaryChar = (typeof DEFAULT_DICTIONARY)[number];

export const getLetterFromIndex = (input: number) => DEFAULT_DICTIONARY[input];

export const getIndexFromLetter = (input: DictionaryChar) =>
  DEFAULT_DICTIONARY.indexOf(input);
