import { EnigmaPlugboard } from "./EnigmaPlugboard";
import { EnigmaReflector } from "./EnigmaReflector";
import { EnigmaRotor } from "./EnigmaRotor";
import {
  DictionaryChar,
  getIndexFromLetter,
  DEFAULT_DICTIONARY,
} from "./utils/Dictionary";
import * as EnigmaLogger from "./utils/Logger";

export class Enigma {
  private rotors: EnigmaRotor[];
  private plugboard: EnigmaPlugboard;
  private reflector: EnigmaReflector;

  constructor(
    rotors: [EnigmaRotor, EnigmaRotor, EnigmaRotor],
    plugboard: EnigmaPlugboard,
    reflector: EnigmaReflector,
  ) {
    // So from logic perspective rotors are handled from back to front
    // but in configuration they are called from front to back
    // to keep config simple, do reverse here
    this.rotors = rotors.reverse();
    this.plugboard = plugboard;
    this.reflector = reflector;
  }

  public encodeLetter(incomingLetter: DictionaryChar) {
    let encodedLetterIndex: number;
    encodedLetterIndex = getIndexFromLetter(incomingLetter);
    EnigmaLogger.debug(encodedLetterIndex, " INCOMING LETTER");

    encodedLetterIndex = this.plugboard.getOutput(encodedLetterIndex);
    EnigmaLogger.debug(encodedLetterIndex, "1ST PLUG FLOW");

    let moveRotorPosition = true;
    for (let i = 0; i < this.rotors.length; i++) {
      const currentRotor = this.rotors[i];
      if (moveRotorPosition) {
        moveRotorPosition = currentRotor.moveRotorPosition() ?? false;
        EnigmaLogger.debug(encodedLetterIndex, "MOVED ROTOR ");
      }
      encodedLetterIndex = currentRotor.getOutgoingLetter(encodedLetterIndex);
      EnigmaLogger.debug(encodedLetterIndex, "INCOMING ROTOR OUTPUT");
    }
    encodedLetterIndex = this.reflector.getOutput(encodedLetterIndex);
    EnigmaLogger.debug(encodedLetterIndex, "REFLECTOR OUTPUT");

    for (let i = this.rotors.length - 1; i >= 0; i--) {
      const currentRotor = this.rotors[i];
      encodedLetterIndex = currentRotor.getIncomingLetter(encodedLetterIndex);
      EnigmaLogger.debug(encodedLetterIndex, "OUTGOING ROTOR OUTPUT");
    }

    encodedLetterIndex = this.plugboard.getOutput(encodedLetterIndex);
    EnigmaLogger.debug(encodedLetterIndex, "2ND PLUG FLOW - OUTGOING LETTER");

    return DEFAULT_DICTIONARY[encodedLetterIndex]!;
  }

  public encodeWord(inputWord: string) {
    return inputWord
      .split("")
      .map((l) => {
        const outputLetter = this.encodeLetter(l as DictionaryChar);
        EnigmaLogger.debugNewLine();
        return outputLetter;
      })
      .join("");
  }
}
