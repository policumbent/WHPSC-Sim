export class Settings {
    private readonly _totalWeight: number;
    private readonly _wheelsInertia: number;
    private readonly _wheelsRadius: number;
    private readonly _efficiency: number;
    private readonly _area: number;
    private readonly _rho: number;

    constructor(bikeWeight: number, riderWeight: number, wheelsInertia: number, wheelsRadius: number, efficiency: number, area: number, rho: number) {
        this._totalWeight = bikeWeight + riderWeight;
        this._wheelsInertia = wheelsInertia;
        this._wheelsRadius = wheelsRadius;
        this._efficiency = efficiency;
        this._area = area;
        this._rho = rho;
    }

    get totalWeight(): number {
        return this._totalWeight;
    }

    get wheelsInertia(): number {
        return this._wheelsInertia;
    }

    get wheelsRadius(): number {
        return this._wheelsRadius;
    }

    get efficiency(): number {
        return this._efficiency;
    }

    get area(): number {
        return this._area;
    }


    get rho(): number {
        return this._rho;
    }
}
