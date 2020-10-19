class BikeSettings {
  private readonly _bikeWeight: number; // kg
  private readonly _wheelsInertia: number;
  private readonly _wheelsCircumference: number; // m
  private readonly _efficiency: number;
  private readonly _area: number; // m²
  private readonly _cx: number;
  private readonly _coefficientsFile: string;

  constructor(
      bikeWeight: number,
      wheelsInertia: number,
      wheelsCircumference: number,
      efficiency: number,
      area: number,
      cx: number,
      coefficientsFile: string,
  ) {
    this._bikeWeight = bikeWeight;
    this._wheelsInertia = wheelsInertia;
    this._wheelsCircumference = wheelsCircumference;
    this._efficiency = efficiency;
    this._area = area;
    this._cx = cx;
    this._coefficientsFile = coefficientsFile;
  }

  get bikeWeight(): number {
    return this._bikeWeight;
  }

  get wheelsInertia(): number {
    return this._wheelsInertia;
  }

  get wheelsCircumference(): number {
    return this._wheelsCircumference;
  }

  get wheelsRadius(): number {
    return this._wheelsCircumference/(2*3.1415);
  }

  get efficiency(): number {
    return this._efficiency;
  }

  get area(): number {
    return this._area;
  }

  get cx(): number {
    return this._cx;
  }

  get coefficientsFile(): string {
    return this._coefficientsFile;
  }
}

class UserSettings {
  private readonly _riderWeight: number;
  private readonly _riderHeight: number;
  private readonly _temperature: number;
  private readonly _altitude: number;
  private readonly _humidity: number;
  private readonly _rho: number;

  constructor(
      riderWeight: number,
      riderHeight: number,
      temperature: number,
      altitude:number,
      humidity: number) {
    this._riderWeight = riderWeight;
    this._riderHeight = riderHeight;
    this._altitude = parseInt(String(altitude));
    this._temperature = parseInt(String(temperature));
    this._humidity = parseInt(String(humidity));
    const p = 6.1078 * Math.pow(10, ((7.5*(this._temperature + 273.15)-2048.625)/(this._temperature+273.15-35.85)));
    this._rho = (this.pressure(this._altitude)*100-this._humidity*p) /
        (287.05*(this._temperature+273.15)) + (this._humidity*p) /
        (461.495*(this._temperature+273.15));
    console.log('rho', this._rho);
  }
  pressure(altitude: number): number {
    return 10.1325*(-0.0101*altitude+98.7);
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

  get temperature(): number {
    return this._temperature;
  }

  get altitude(): number {
    return this._altitude;
  }

  get humidity(): number {
    return this._humidity;
  }
}

class Bike {
  bikeName: string;
  imgSrc: string;
  description: string;
  settings: BikeSettings;

  constructor(
      bikeName: string,
      imgSrc: string,
      description: string,
      settings: BikeSettings,
  ) {
    this.bikeName = bikeName;
    this.imgSrc = imgSrc;
    this.description = description;
    this.settings = settings;
  }
}

export { Bike, BikeSettings, UserSettings };
