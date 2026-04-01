import { EnigmaPlug } from "./EnigmaPlug.class";

export class EnigmaPlugboard {
  private plugs: Array<EnigmaPlug>;
  private swapMap: Map<number, number>;

  constructor(plugs?: Array<EnigmaPlug>) {
    this.validatePlugConnections(plugs || []);
    this.plugs = plugs || [];
    this.swapMap = new Map();
    for (const plug of this.plugs) {
      this.swapMap.set(plug.getPointA(), plug.getPointB());
      this.swapMap.set(plug.getPointB(), plug.getPointA());
    }
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
            `Invalid plugboard configuration ${currentPlug}:${comparePlug}`,
          );
        }
      }
    }
  }

  public addPlug(plug: EnigmaPlug) {
    const newPlugboard = [...this.plugs, plug];
    this.validatePlugConnections(newPlugboard);
    this.plugs.push(plug);
    this.swapMap.set(plug.getPointA(), plug.getPointB());
    this.swapMap.set(plug.getPointB(), plug.getPointA());
  }

  public removePlug(plug: EnigmaPlug) {
    const removeIndex = this.plugs.findIndex((p) => p.isEqual(plug));
    if (removeIndex !== -1) {
      const removed = this.plugs[removeIndex];
      this.plugs.splice(removeIndex, 1);
      this.swapMap.delete(removed.getPointA());
      this.swapMap.delete(removed.getPointB());
    }
  }

  public getOutput(input: number) {
    return this.swapMap.get(input) ?? input;
  }
}
