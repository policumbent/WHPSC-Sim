import type { BikeSettings, UserSettings } from "./Settings";

export default class ResultModel {
  firstName: string;
  lastName: string;
  bikeName: string;
  email: string;
  speed: number;
  power: number;
  datetime: Date;
  expanded: boolean;
  bikeSettings: BikeSettings;
  userSettings: UserSettings;

  constructor(
    speed: number,
    power: number,
    bikeSettings: BikeSettings,
    userSettings: UserSettings,
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
    this.power = power;
    this.bikeName = bikeName;
    this.bikeSettings = bikeSettings;
    this.userSettings = userSettings;
    this.expanded = expanded;
    timestamp.concat(" ");
    timestamp.concat(" ");
    const t = timestamp.split(/[- :]/);
    // console.log(timestamp);
    // console.log(t);
    this.datetime = new Date(Date.UTC(
      Number(t[0]),
      Number(t[1])-1,
      Number(t[2]),
      Number(t[3]),
      Number(t[4]),
      Number(t[5]),
    ));
  }

  get date(): string {
    return `${this.datetime.getDate()}/${this.datetime.getMonth()+1}/${this.datetime.getFullYear()}`;
  }
  checkTime(i) {
        return (i < 10) ? '0' + i : i;
  }

  get time(): string {
    return `${this.checkTime(this.datetime.getHours())}:${
      this.checkTime(this.datetime.getMinutes())
    }`;
  }
}
