import { vAny } from './h.ts';
import { destroyDOM } from './destroyDOM.ts';
import { mountDOM } from './mountDOM.ts';
import { Dispatcher } from './dispatcher.ts';
import { patchDOM } from './patchDOM.ts';


export type PayloadOf<Reducer> =
    Reducer extends (state: any, payload: infer P) => any
    ? P
    : never;

export type Reducer<State, Payload = any> = (state: State, payload: Payload) => State;
export type Reducers<State> = Record<string, Reducer<State>>

export type Emit<ReducerList extends Reducers<any>> = <Key extends keyof ReducerList>(commandName: Key, payload: PayloadOf<ReducerList[Key]>) => void;

export type CreateAppProps<State, ReducerList extends Reducers<State>> = {
    state: State;
    view: (state: State, emit: Emit<ReducerList>) => vAny;
    reducers: ReducerList;
}

export const createApp = function <State, ReducerList extends Reducers<State>> (props: CreateAppProps<State, ReducerList>) {
    let { state, view, reducers } = props;

    const dispatcher                      = new Dispatcher<ReducerList>();
    let parentElement: HTMLElement | null = null;
    let vDom: vAny | null                 = null;

    const emit: Emit<ReducerList> = function (eventName, payload) {
        dispatcher.dispatch(eventName, payload);
    };

    const renderApp = function () {
        const newVDom = view(state, emit);
        if (vDom && newVDom && parentElement) {
            vDom = patchDOM(vDom, newVDom, parentElement);
        }
    };

    const subscriptions = [ dispatcher.afterEveryCommand(renderApp) ];

    for (const actionName in reducers) {
        const reducer = reducers[actionName];
        const subs    = dispatcher.subscribe(actionName, (payload) => {
            state = reducer(state, payload);
        });
        subscriptions.push(subs);
    }

    const mount = function (_parentElement: HTMLElement) {
        if (vDom) {
            throw new Error(`App is mounted`);
        }

        parentElement = _parentElement;
        vDom          = view(state, emit);
        if (vDom && parentElement) {
            mountDOM(parentElement, vDom);
        }
    };

    const unmount = function () {
        if (vDom) {
            destroyDOM(vDom);
            vDom = null;
            subscriptions.forEach((unsubscribe) => unsubscribe());
        }
    };

    return { mount, unmount };
};