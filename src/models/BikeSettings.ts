export class BikeSettings {
    private readonly _bikeWeight: number;
    private readonly _wheelsInertia: number;
    private readonly _wheelsRadius: number;
    private readonly _efficiency: number;
    private readonly _area: number;
    private readonly _rho: number;
    private readonly _cx: number;

    constructor(bikeWeight: number, wheelsInertia: number, wheelsRadius: number,
                efficiency: number, area: number, rho: number, cx:number) {
        this._bikeWeight = bikeWeight;
        this._wheelsInertia = wheelsInertia;
        this._wheelsRadius = wheelsRadius;
        this._efficiency = efficiency;
        this._area = area;
        this._rho = rho;
        this._cx = cx;
    }

    get bikeWeight(): number {
        return this._bikeWeight;
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

    get cx(): number {
        return this._cx;
    }
}
