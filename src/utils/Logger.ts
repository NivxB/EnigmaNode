import { getLetterFromIndex } from "./Dictionary";

export type LogLevel = "DEBUG" | "NONE";

let level: LogLevel = "NONE";

export const setLogLevel = (l: LogLevel) => {
  level = l;
};

export const debug = (letter: number, ...args: unknown[]) => {
  if (level === "DEBUG") {
    console.debug(getLetterFromIndex(letter), ...args);
  }
};

export const debugNewLine = () => {
  if (level === "DEBUG") {
    console.debug("\n");
  }
};
