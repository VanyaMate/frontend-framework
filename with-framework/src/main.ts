import { f, h } from './runtime/h.ts';


const login = function () {
    console.log('login');
};

const form = h('form', { class: 'login-form', action: 'login' }, [
    h('input', { type: 'text', name: 'username' }),
    h('input', { type: 'password', name: 'password' }),
    h('button', {
        type : 'submit',
        class: 'btn btn-primary',
        on   : { click: login },
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

console.log(form, counter);