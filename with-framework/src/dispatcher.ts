export class Dispatcher {
    #subs: Map<string, Array<Function>> = new Map();
    #afterEveryCommand: Array<Function> = [];

    afterEveryCommand (handler: Function): () => void {
        this.#afterEveryCommand.push(handler);

        return () => {
            const index = this.#afterEveryCommand.indexOf(handler);
            if (~index) {
                this.#afterEveryCommand.splice(index, 1);
            }
        };
    }

    subscribe (commandName: string, handler: Function): () => void {
        if (!this.#subs.has(commandName)) {
            this.#subs.set(commandName, []);
        }

        const handlers = this.#subs.get(commandName);
        if (handlers!.includes(handler)) {
            return () => {
            };
        }

        handlers!.push(handler);
        return () => {
            const index = handlers!.indexOf(handler);
            if (~index) {
                handlers!.splice(index, 1);
            }
        };
    }

    dispatch<T> (commandName: string, payload: T): void {
        if (this.#subs.has(commandName)) {
            this.#subs.get(commandName)!.forEach((handler: Function) => handler(payload));
        }
        this.#afterEveryCommand.forEach((handler: Function) => handler());
    }
}