export class UserSettings {
    private readonly _riderWeight: number;
    private readonly _riderHeight: number;
    private readonly _rho: number;

    constructor(riderWeight: number, riderHeight: number, rho: number) {
        this._riderWeight = riderWeight;
        this._riderHeight = riderHeight;
        this._rho = rho;
    }

    get riderWeight(): number {
        return this._riderWeight;
    }

    get riderHeight(): number {
        return this._riderHeight;
    }

    get rho(): number {
        return this._rho;
    }
}
