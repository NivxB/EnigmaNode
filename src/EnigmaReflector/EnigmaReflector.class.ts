import { EnigmaReflectorConfiguration } from "./EnigmaReflector.interface";

export class EnigmaReflector {
    private id: string;
    private configuration: Array<EnigmaReflectorConfiguration>;

    constructor(id: string, configuration: Array<EnigmaReflectorConfiguration>) {
        this.id = id;
        this.configuration = configuration;
    }

    public getOutput(input: number) {
        return this.configuration.find(c => c.input === input)?.output
    }
}