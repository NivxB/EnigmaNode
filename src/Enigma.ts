import { DEFAULT_DICTIONARY } from "./Enigma.configuration";
import { EnigmaPlugboard } from "./EnigmaPlugboard";
import { EnigmaReflector } from "./EnigmaReflector";
import { EnigmaRotor } from "./EnigmaRotor";
import { EnigmaLogger } from "./utils/Logger";

export class Enigma {
  private rotors: Array<EnigmaRotor>;
  private plugboard: EnigmaPlugboard;
  private reflector: EnigmaReflector;

  constructor(
    rotors?: Array<EnigmaRotor>,
    plugboard?: EnigmaPlugboard,
    reflector?: EnigmaReflector
  ) {
    this.rotors = rotors || [];
    this.plugboard = plugboard || new EnigmaPlugboard();
    this.reflector = reflector;
  }

  public encodeLetter(incomingLetter: string) {
    let encodedLetter;
    encodedLetter = DEFAULT_DICTIONARY.indexOf(incomingLetter.toUpperCase());
    EnigmaLogger.debug(encodedLetter, " INCOMING LETTER");

    encodedLetter = this.plugboard.getOutput(encodedLetter);
    EnigmaLogger.debug(encodedLetter, "1ST PLUG FLOW");

    let moveRotorPosition = true;
    for (let i = 0; i < this.rotors.length; i++) {
      const currentRotor = this.rotors[i];
      if (moveRotorPosition) {
        moveRotorPosition = currentRotor.moveRotorPosition();
        EnigmaLogger.debug(
          encodedLetter,
          "MOVED ROTOR " + currentRotor.getId()
        );
      }
      encodedLetter = currentRotor.getOutgoingLetter(encodedLetter);
      EnigmaLogger.debug(
        encodedLetter,
        "INCOMING ROTOR " + currentRotor.getId() + " OUTPUT"
      );
    }
    encodedLetter = this.reflector.getOutput(encodedLetter);
    EnigmaLogger.debug(encodedLetter, "REFLECTOR OUTPUT");

    for (let i = this.rotors.length - 1; i >= 0; i--) {
      const currentRotor = this.rotors[i];
      encodedLetter = currentRotor.getIncomingLetter(encodedLetter);
      EnigmaLogger.debug(
        encodedLetter,
        "OUTGOING ROTOR " + currentRotor.getId() + " OUTPUT"
      );
    }

    encodedLetter = this.plugboard.getOutput(encodedLetter);
    EnigmaLogger.debug(encodedLetter, "2ND PLUG FLOW - OUTGOING LETTER");

    return DEFAULT_DICTIONARY.charAt(encodedLetter);
  }

  public encodeWord(inputWord: string) {
    return inputWord
      .split("")
      .map((l) => {
        const outputLetter = this.encodeLetter(l);
        EnigmaLogger.debugNewLine();
        return outputLetter;
      })
      .join("");
  }
}
