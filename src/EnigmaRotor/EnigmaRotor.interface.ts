export const ROTOR_CONFIGURATION_LENGTH = 26;

export interface EnigmaRotorConfiguration {
    input: number,
    output: number,
    turnOver?: boolean;
}