import { DictionaryChar, getIndexFromLetter } from "../utils/Dictionary";
import {
  EnigmaRotorConfiguration,
  ROTOR_CONFIGURATION_LENGTH,
} from "./EnigmaRotor.interface";

export class EnigmaRotor {
  private ringOffset: number;
  private currentPosition: number;
  private configuration: Array<EnigmaRotorConfiguration>;

  constructor(
    configuration: Array<EnigmaRotorConfiguration>,
    initialPosition: DictionaryChar,
    ringOffset: DictionaryChar,
  ) {
    this.ringOffset = getIndexFromLetter(ringOffset);
    this.currentPosition = getIndexFromLetter(initialPosition);
    this.configuration = configuration;
  }

  public getPosition() {
    return this.currentPosition;
  }

  public setPosition(position: number) {
    this.currentPosition = position;
  }

  private getConnection(connection: {
    input?: number;
    output?: number;
  }): EnigmaRotorConfiguration {
    return this.configuration.find(
      (c) => c.input === connection.input || c.output === connection.output,
    )!;
  }

  public getOutgoingLetter(input: number) {
    const transformInput =
      (ROTOR_CONFIGURATION_LENGTH -
        this.ringOffset +
        input +
        this.currentPosition) %
      ROTOR_CONFIGURATION_LENGTH;

    const encodedLetter = this.getConnection({ input: transformInput }).output;
    return (
      (ROTOR_CONFIGURATION_LENGTH +
        encodedLetter -
        this.currentPosition +
        this.ringOffset) %
      ROTOR_CONFIGURATION_LENGTH
    );
  }

  public getIncomingLetter(output: number) {
    const transformOutput =
      (ROTOR_CONFIGURATION_LENGTH -
        this.ringOffset +
        output +
        this.currentPosition) %
      ROTOR_CONFIGURATION_LENGTH;
    const encodedLetter = this.getConnection({ output: transformOutput }).input;
    return (
      (ROTOR_CONFIGURATION_LENGTH +
        encodedLetter -
        this.currentPosition +
        this.ringOffset) %
      ROTOR_CONFIGURATION_LENGTH
    );
  }

  public moveRotorPosition() {
    this.currentPosition =
      (ROTOR_CONFIGURATION_LENGTH + this.currentPosition + 1) %
      ROTOR_CONFIGURATION_LENGTH;
    const shouldTurnOver = this.configuration[this.currentPosition].turnOver;
    return shouldTurnOver;
  }
}
