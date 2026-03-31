import { getLetterFromIndex } from "./Dictionary";

export const debug = (letter: number, ...args: unknown[]) => {
  if (process.env.DEBUG) {
    console.debug(getLetterFromIndex(letter), ...args);
  }
};

export const debugNewLine = () => {
  if (process.env.DEBUG) {
    console.debug("\n");
  }
};
