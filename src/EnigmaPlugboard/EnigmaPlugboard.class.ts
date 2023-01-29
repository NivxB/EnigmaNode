import { EnigmaPlug } from "./EnigmaPlub.class";

export class EnigmaPlugboard {
  private plugs: Array<EnigmaPlug>;

  constructor(plugs?: Array<EnigmaPlug>) {
    this.validatePlugConnections(plugs || []);
    this.plugs = plugs || [];
  }

  private validatePlugConnections(plugs: Array<EnigmaPlug>) {
    for (let i = 0; i < plugs.length; i++) {
      const currentPlug = plugs[i];
      for (let j = 0; j < plugs.length; j++) {
        if (i === j) {
          continue;
        }
        const comparePlug = plugs[j];
        if (
          currentPlug.getPointA() === comparePlug.getPointA() ||
          currentPlug.getPointA() === comparePlug.getPointB() ||
          currentPlug.getPointB() === comparePlug.getPointA() ||
          currentPlug.getPointB() === comparePlug.getPointB()
        ) {
          throw Error(
            `Invalid plugboard configuration ${currentPlug}:${comparePlug}`
          );
        }
      }
    }
  }

  public addPlug(plug: EnigmaPlug) {
    const newPlugboard = [...this.plugs, plug];
    this.validatePlugConnections(newPlugboard);
    this.plugs.push(plug);
  }

  public removePlug(plug: EnigmaPlug) {
    const removeIndex = this.plugs.findIndex((p) => p.isEqual(plug));
    if (removeIndex !== -1) {
      this.plugs.splice(removeIndex, 1);
    }
  }

  public getOutput(input: number) {
    for (let i = 0; i < this.plugs.length; i++) {
      const output = this.plugs[i].getOutput(input);
      if (output) {
        return output;
      }
    }
    return input;
  }
}
