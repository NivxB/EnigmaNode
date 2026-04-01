import { EnigmaPlugboard } from "./EnigmaPlugboard";
import { EnigmaReflector } from "./EnigmaReflector";
import { EnigmaRotor } from "./EnigmaRotor";
import {
  DictionaryChar,
  getIndexFromLetter,
  DEFAULT_DICTIONARY,
  getLetterFromIndex,
} from "./utils/Dictionary";
import * as EnigmaLogger from "./utils/Logger";

interface EncodeTraceStage {
  stage: string;
  input: DictionaryChar;
  output: DictionaryChar;
}

interface EncodeTrace {
  input: DictionaryChar;
  output: DictionaryChar;
  rotorsBefore: string;
  rotorsAfter: string;
  stages: EncodeTraceStage[];
}

export class Enigma {
  private rotors: EnigmaRotor[];
  private plugboard: EnigmaPlugboard;
  private reflector: EnigmaReflector;
  private encodeTraces: EncodeTrace[];

  constructor(
    rotors: [EnigmaRotor, EnigmaRotor, EnigmaRotor],
    plugboard: EnigmaPlugboard,
    reflector: EnigmaReflector,
  ) {
    // So from logic perspective rotors are handled from back to front
    // but in configuration they are called from front to back
    // to keep config simple, do reverse here
    this.rotors = [...rotors].reverse();
    this.plugboard = plugboard;
    this.reflector = reflector;
    this.encodeTraces = [];
  }

  private stepRotors() {
    const midAtNotch = this.rotors[1].isAtNotch();
    const rightAtNotch = this.rotors[0].isAtNotch();

    // Double Step Anomally
    if (midAtNotch) {
      EnigmaLogger.debug(0, "DOUBLE STEP ANOMALLY");
      this.rotors[2].moveRotorPosition();
      this.rotors[1].moveRotorPosition();
    } else if (rightAtNotch) {
      this.rotors[1].moveRotorPosition();
    }
    this.rotors[0].moveRotorPosition();
  }

  public encodeLetter(incomingLetter: DictionaryChar) {
    const initialRotorTrace = this.getRotorsTrace();

    const encodedLetterIndex = getIndexFromLetter(incomingLetter);
    EnigmaLogger.debug(encodedLetterIndex, " INCOMING LETTER");
    const letterStages: EncodeTraceStage[] = [];

    const plugboardFwdIndex = this.plugboard.getOutput(encodedLetterIndex);
    EnigmaLogger.debug(plugboardFwdIndex, "1ST PLUG FLOW");
    letterStages.push({
      stage: "plugboard-in",
      input: getLetterFromIndex(encodedLetterIndex),
      output: getLetterFromIndex(plugboardFwdIndex),
    });

    this.stepRotors();

    let rotorsFwdIndex = plugboardFwdIndex;
    for (let i = 0; i < this.rotors.length; i++) {
      const rotorIn = rotorsFwdIndex;
      rotorsFwdIndex = this.rotors[i].getOutgoingLetter(rotorIn);
      EnigmaLogger.debug(rotorsFwdIndex, "INCOMING ROTOR OUTPUT");
      letterStages.push({
        stage: `rotor-fwd-${i}`,
        input: getLetterFromIndex(rotorIn),
        output: getLetterFromIndex(rotorsFwdIndex),
      });
    }

    const reflectorIndex = this.reflector.getOutput(rotorsFwdIndex);
    EnigmaLogger.debug(reflectorIndex, "REFLECTOR OUTPUT");
    letterStages.push({
      stage: "reflector",
      input: getLetterFromIndex(rotorsFwdIndex),
      output: getLetterFromIndex(reflectorIndex),
    });

    let rotorsBwdIndex = reflectorIndex;
    for (let i = this.rotors.length - 1; i >= 0; i--) {
      const rotorIn = rotorsBwdIndex;
      rotorsBwdIndex = this.rotors[i].getIncomingLetter(rotorIn);
      EnigmaLogger.debug(rotorsBwdIndex, "OUTGOING ROTOR OUTPUT");
      letterStages.push({
        stage: `rotor-bwd-${i}`,
        input: getLetterFromIndex(rotorIn),
        output: getLetterFromIndex(rotorsBwdIndex),
      });
    }

    const plugboardBwdIndex = this.plugboard.getOutput(rotorsBwdIndex);
    EnigmaLogger.debug(plugboardBwdIndex, "2ND PLUG FLOW - OUTGOING LETTER");
    letterStages.push({
      stage: "plugboard-out",
      input: getLetterFromIndex(rotorsBwdIndex),
      output: getLetterFromIndex(plugboardBwdIndex),
    });
    const outputRotorTrace = this.getRotorsTrace();

    const encodeTrace = {
      input: getLetterFromIndex(encodedLetterIndex),
      output: getLetterFromIndex(plugboardBwdIndex),
      rotorsBefore: initialRotorTrace,
      rotorsAfter: outputRotorTrace,
      stages: letterStages,
    };
    this.encodeTraces.push(encodeTrace);

    return encodeTrace;
  }

  public encodeWord(inputWord: string) {
    return inputWord
      .split("")
      .map((l) => {
        const outputLetter = this.encodeLetter(l as DictionaryChar);
        EnigmaLogger.debugNewLine();
        return outputLetter.output;
      })
      .join("");
  }

  public getRotorPositions() {
    // return left -> right
    return [...this.rotors].reverse().map((rotor) => rotor.getPosition());
  }

  public getRotorsTrace() {
    return this.getRotorPositions()
      .map((letterIndex) => getLetterFromIndex(letterIndex))
      .join("");
  }

  public reset() {
    this.rotors.forEach((rotor) => rotor.reset());
    this.encodeTraces = [];
  }
}
