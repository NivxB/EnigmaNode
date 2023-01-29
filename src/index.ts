import { Enigma } from "./Enigma";
import {
  REFLECTOR_B,
  ROTOR_I,
  ROTOR_II,
  ROTOR_III,
} from "./Enigma.configuration";
import { EnigmaPlug, EnigmaPlugboard } from "./EnigmaPlugboard";
import { EnigmaReflector } from "./EnigmaReflector";
import { EnigmaRotor } from "./EnigmaRotor";

const enigmaMachine = new Enigma(
  [
    new EnigmaRotor("III", 0, 1, ROTOR_III),
    new EnigmaRotor("II", 0, 1, ROTOR_II),
    new EnigmaRotor("I", 0, 1, ROTOR_I),
  ],
  new EnigmaPlugboard([new EnigmaPlug(0, 1)]),
  new EnigmaReflector("B", REFLECTOR_B)
);

const TEST_INPUT = "SKOLLCUTEDOG";
//const TEST_INPUT = 'IGWZYUITDVXS'
let output = enigmaMachine.encodeWord(TEST_INPUT)

console.log(output);
