import { DictionaryChar, getIndexFromLetter } from "../utils/Dictionary";
import {
  EnigmaRotorConfiguration,
  ROTOR_CONFIGURATION_LENGTH,
} from "./EnigmaRotor.interface";

export class EnigmaRotor {
  private ringOffset: number;
  private initialPosition: number;

  private currentPosition: number;
  private configuration: Array<EnigmaRotorConfiguration>;

  constructor(
    configuration: Array<EnigmaRotorConfiguration>,
    initialPosition: DictionaryChar,
    ringOffset: DictionaryChar,
  ) {
    this.ringOffset = getIndexFromLetter(ringOffset);
    this.initialPosition = getIndexFromLetter(initialPosition);
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

  private applyOffset(index: number): number {
    return (
      (ROTOR_CONFIGURATION_LENGTH -
        this.ringOffset +
        index +
        this.currentPosition) %
      ROTOR_CONFIGURATION_LENGTH
    );
  }

  private removeOffset(index: number): number {
    return (
      (ROTOR_CONFIGURATION_LENGTH +
        index -
        this.currentPosition +
        this.ringOffset) %
      ROTOR_CONFIGURATION_LENGTH
    );
  }

  public getOutgoingLetter(input: number) {
    return this.removeOffset(
      this.getConnection({ input: this.applyOffset(input) }).output,
    );
  }

  public getIncomingLetter(output: number) {
    return this.removeOffset(
      this.getConnection({ output: this.applyOffset(output) }).input,
    );
  }

  public moveRotorPosition() {
    this.currentPosition =
      (ROTOR_CONFIGURATION_LENGTH + this.currentPosition + 1) %
      ROTOR_CONFIGURATION_LENGTH;
  }

  public isAtNotch() {
    return this.configuration[this.currentPosition].notch;
  }

  public reset() {
    return (this.currentPosition = this.initialPosition);
  }
}
