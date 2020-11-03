export default class Antelope {
    img;
    started: boolean;
    distance: number;
    visible: boolean;
    probability: number;
    maxDistance: number;
    timeout;

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //Il max è escluso e il min è incluso
    }

    constructor(maxDistance: number, probability: number) {
        this.probability = probability;
        this.maxDistance = maxDistance;
        this.random()
    }

    random() {
        this.started = false;
        this.distance = this.getRandomInt(200, this.maxDistance);
        console.log(this.distance)
        this.visible = this.getRandomInt(0, 10) >= (10-(this.probability*10));
        console.log(this.visible)
    }

    is_visible(distance: number): boolean{
        return this.visible &&
            !this.started &&
            distance > this.distance &&
            distance < this.distance + 100
    }
}
