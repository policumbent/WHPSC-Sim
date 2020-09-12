import type { BikeSettings } from "./Bike";

export default class ResultModel {
  firstName: string;
  lastName: string;
  bikeName: string;
  email: string;
  speed: number;
  datetime: Date;
  expanded: boolean;
  bikeSettings: BikeSettings;

  constructor(
    speed: number,
    bikeSettings: BikeSettings,
    bikeName: string,
    firstName: string = "",
    lastName: string = "",
    email: string = "",
    timestamp: string = "",
    expanded: boolean = false,
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.speed = speed;
    this.bikeName = bikeName;
    this.bikeSettings = bikeSettings;
    this.expanded = expanded;
    timestamp.concat(" ");
    const t = timestamp.split(/[- :]/);
    console.log(timestamp);
    console.log(t);
    this.datetime = new Date(Date.UTC(
      Number(t[0]),
      Number(t[1]),
      Number(t[2]),
      Number(t[3]),
      Number(t[4]),
      Number(t[5]),
    ));
  }

  get date(): string {
    return `${this.datetime.getDate()}/${this.datetime.getMonth()}/${this.datetime.getFullYear()}`;
  }

  checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

  get time(): string {
    return `${this.checkTime(this.datetime.getHours())}:${
      this.checkTime(this.datetime.getMinutes())
    }`;
  }
}
