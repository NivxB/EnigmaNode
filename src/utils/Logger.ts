import { DEFAULT_DICTIONARY } from "../Enigma.configuration";

export namespace EnigmaLogger {
  const transformNumberToLetter = (input: number) =>
    DEFAULT_DICTIONARY.charAt(input);

  export const debug = (letter: number, ...args) => {
    if (process.env.DEBUG) {
      console.debug(transformNumberToLetter(letter), ...args);
    }
  };

  export const debugNewLine = () => {
    if (process.env.DEBUG) {
      console.debug("\n");
    }
  };
}
