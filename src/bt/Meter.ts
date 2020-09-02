export abstract class Meter {
    listeners = {};
    timeoutID;
    milliTimeout : number;

    protected constructor () {
        this.listeners = {};
        this.timeoutID = undefined;
        this.milliTimeout = 8000;
    }

    clearValueOnTimeout(value) {
        if(this.timeoutID !== undefined) {
            clearTimeout(this.timeoutID);
        }
        this.timeoutID = setTimeout(() => {
            this.timeoutID = undefined;
            if(value.constructor === Array) {
                for(let v of value) {
                    this.dispatch(0);
                }
            } else {
                this.dispatch( 0);
            }
        }, this.milliTimeout);
    }

    abstract dispatch(value);
}
