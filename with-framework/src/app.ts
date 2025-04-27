import { vElement } from './h.ts';
import { destroyDOM } from './destroyDOM.ts';
import { mountDOM } from './mountDOM.ts';
import { Dispatcher } from './dispatcher.ts';


export type CreateAppProps = {
    state: any;
    view: any;
    reducers: any;
}

export const createApp = function (props: CreateAppProps) {
    let { state, view, reducers } = props;

    const dispatcher                      = new Dispatcher();
    let parentElement: HTMLElement | null = null;
    let vDom: vElement | null             = null;

    const emit = function (eventName: string, payload: any) {
        dispatcher.dispatch(eventName, payload);
    };

    const mount = function (mountTo: HTMLElement | null = null) {
        if (mountTo) {
            parentElement = mountTo;
        }

        if (vDom) {
            destroyDOM(vDom);
        }

        vDom = view(state, emit);

        if (parentElement && vDom) {
            mountDOM(parentElement, vDom);
        }
    };

    const subscriptions = [ dispatcher.afterEveryCommand(mount) ];

    for (const actionName in reducers) {
        const reducer = reducers[actionName];
        const subs    = dispatcher.subscribe(actionName, (payload: any) => {
            state = reducer(state, payload);
        });
        subscriptions.push(subs);
    }

    const unmount = function () {
        if (vDom) {
            destroyDOM(vDom);
            vDom = null;
            subscriptions.forEach((unsubscribe) => unsubscribe());
        }
    };

    return { mount, unmount };
};