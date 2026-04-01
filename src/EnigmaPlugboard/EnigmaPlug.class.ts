import { DictionaryChar, getIndexFromLetter } from "../utils/Dictionary";

export class EnigmaPlug {
  private pointA: number;
  private pointB: number;

  constructor(pointA: DictionaryChar, pointB: DictionaryChar) {
    if (pointA === pointB) {
      throw Error(`Invalid plug configuration ${pointA}:${pointB}`);
    }
    this.pointA = getIndexFromLetter(pointA);
    this.pointB = getIndexFromLetter(pointB);
  }

  public getPointA() {
    return this.pointA;
  }

  public getPointB() {
    return this.pointB;
  }

  public getOutput(point: number) {
    if (point === this.pointA) {
      return this.pointB;
    } else if (point === this.pointB) {
      return this.pointA;
    }
    return null;
  }

  public isEqual(otherPlug: EnigmaPlug) {
    return this.pointA === otherPlug.pointA && this.pointB == otherPlug.pointB;
  }
}
