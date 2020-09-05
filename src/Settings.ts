export class Settings {
    private readonly _bikeWeight: number;
    private readonly _riderWeight: number;
    private readonly _wheelsInertia: number;
    private readonly _wheelsRadius: number;
    private readonly _efficiency: number;
    private readonly _area: number;
    private readonly _rho: number;
    private readonly _cx: number;
    private readonly _debugMode: boolean;

    constructor(bikeWeight: number, riderWeight: number, wheelsInertia: number, wheelsRadius: number,
                efficiency: number, area: number, rho: number, cx:number, debugMode: boolean) {
        this._bikeWeight = bikeWeight;
        this._riderWeight = riderWeight;
        this._wheelsInertia = wheelsInertia;
        this._wheelsRadius = wheelsRadius;
        this._efficiency = efficiency;
        this._area = area;
        this._rho = rho;
        this._cx = cx;
        this._debugMode = debugMode;
    }

    get bikeWeight(): number {
        return this._bikeWeight;
    }

    get riderWeight(): number {
        return this._riderWeight;
    }

    get totalWeight(): number {
        return this._riderWeight + this._bikeWeight;
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

    get debugMode(): boolean {
        return this._debugMode;
    }

    get cx(): number {
        return this._cx;
    }
}
