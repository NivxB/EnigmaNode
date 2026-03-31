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
    new EnigmaRotor(ROTOR_I, "A", "B"),
    new EnigmaRotor(ROTOR_II, "A", "B"),
    new EnigmaRotor(ROTOR_III, "A", "B"),
  ],
  new EnigmaPlugboard([new EnigmaPlug("S", "A"), new EnigmaPlug("K", "O")]),
  new EnigmaReflector(REFLECTOR_B),
);

//const TEST_INPUT = "SKOLLCUTEDOG";
const TEST_INPUT = "DLCUMLFVMXYD";
const output = enigmaMachine.encodeWord(TEST_INPUT);

console.log(output);
