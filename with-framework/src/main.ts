import { f, h } from './h.ts';
import { mountDOM } from './mountDOM.ts';
import { createApp, Reducers } from './app.ts';


const login = function (event: Event) {
    console.log('login');
    event.preventDefault();
};

const form = h('form', { class: 'login-form', action: 'login' }, [
    h('input', { type: 'text', name: 'username' }),
    h('input', { type: 'password', name: 'password' }),
    h('button', {
        type: 'submit',
        class: 'btn btn-primary',
        on: { click: login },
    }, [ 'Log in' ]),
]);

const counter = f([
    h('h1', { class: 'title' }, [ 'My counter' ]),
    h('div', { class: 'container' }, [
        h('button', {}, [ 'decrement' ]),
        h('span', {}, [ '0' ]),
        h('button', {}, [ 'increment' ]),
    ]),
]);

mountDOM(document.querySelector('#app')!, form);
mountDOM(document.querySelector('#app2')!, counter);

const state = {
    counter: 0,
};

const reducers: Reducers<typeof state> = {
    increment (state, payload: number) {
        return {
            counter: state.counter + payload,
        };
    },
    incrementString (state, payload: string) {
        return {
            counter: state.counter + Number(payload),
        };
    },
};

const app = createApp({
    state,
    reducers,
    view: (state, emit) => {
        return h('button', {
            on: {
                click: () => emit('', '1'),
            }
        })
    },
});