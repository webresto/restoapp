export class ObservablePromise<T> {
    private _status: 'pending' | 'fulfilled' | 'rejected' = 'pending';
    private _info: string = null
    private _promise: Promise<T>;

    constructor(promise: Promise<T>, timeout: number) {
        this._promise = new Promise<T>((resolve, reject) => {

            const timerPromise = new Promise((resolve, reject) => {
                const timer = setTimeout(() => {
                    clearTimeout(timer); // Clearing the timer before calling reject
                    reject(new Error(`Promise timed out after ${timeout}ms`));
                }, timeout);

                // use main promise to clear the timer if main promise will be finished first
                promise.then((result) => {
                    clearTimeout(timer);
                    resolve(result);
                }, reject);
            });

            Promise.race([promise, timerPromise])
                .then(
                    (value: T) => {
                        this._status = 'fulfilled';
                        resolve(value);
                    },
                    (error) => {
                        this._status = 'rejected';
                        this._info = error
                        reject(error);
                    }
                );
        });
    }

    get promise(): Promise<T> {
        return this._promise;
    }

    get status(): 'pending' | 'fulfilled' | 'rejected' {
        return this._status;
    }

    get info(): string {
        return this._info
    }
}

