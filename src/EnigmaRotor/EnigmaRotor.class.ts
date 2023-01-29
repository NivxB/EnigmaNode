import {
  EnigmaRotorConfiguration,
  ROTOR_CONFIGURATION_LENGTH,
} from "./EnigmaRotor.interface";

export class EnigmaRotor {
  private id: string;
  private ringOffset: number;
  private currentPosition: number;
  private configuration: Array<EnigmaRotorConfiguration>;

  constructor(
    id: string,
    initialPosition: number,
    ringOffset: number,
    configuration: Array<EnigmaRotorConfiguration>
  ) {
    this.id = id;
    this.ringOffset = ringOffset;
    this.currentPosition = initialPosition;
    this.configuration = configuration;
  }

  public getId() {
    return this.id;
  }

  public getPosition() {
    return this.currentPosition;
  }

  public setPosition(position: number) {
    this.currentPosition = position;
  }

  private getConnection(connection: { input?: number; output?: number }) {
    return this.configuration.find(
      (c) => c.input === connection.input || c.output === connection.output
    );
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
