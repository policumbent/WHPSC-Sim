export default class UserSettings {
  private readonly _riderWeight: number;

  constructor(riderWeight: number) {
    this._riderWeight = riderWeight;
  }

  get riderWeight(): number {
    return this._riderWeight;
  }
}
