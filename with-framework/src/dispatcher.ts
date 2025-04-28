import { PayloadOf } from './app.ts';


export type DispatchSub<Payload> = (payload: Payload) => void;

export class Dispatcher<
    Reducers,
    Command extends keyof Reducers = keyof Reducers,
    Handler extends DispatchSub<PayloadOf<Reducers[Command]>> = DispatchSub<PayloadOf<Reducers[Command]>>,
> {
    #subs: Map<Command, Array<Handler>> = new Map();
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

    subscribe (commandName: Command, handler: Handler): () => void {
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

    dispatch (commandName: Command, payload: PayloadOf<Reducers[Command]>): void {
        if (this.#subs.has(commandName)) {
            this.#subs.get(commandName)!.forEach((handler: Function) => handler(payload));
        }
        this.#afterEveryCommand.forEach((handler: Function) => handler());
    }
}