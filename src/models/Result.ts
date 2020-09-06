export class ResultModel {
    firstName: string;
    lastName: string;
    email: string;
    speed: number;

    constructor(speed:number, firstName: string = "", lastName: string = "", email: string = "") {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.speed = speed;
    }
}
