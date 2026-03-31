import { EnigmaReflectorConfiguration } from "./EnigmaReflector.interface";

export class EnigmaReflector {
  private configuration: Array<EnigmaReflectorConfiguration>;

  constructor(configuration: Array<EnigmaReflectorConfiguration>) {
    this.configuration = configuration;
  }

  public getOutput(input: number) {
    return this.configuration.find((c) => c.input === input)!.output;
  }
}
