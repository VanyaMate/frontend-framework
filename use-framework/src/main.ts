import { createApp, f, h } from '@vanyamate/framework';


createApp({
    state   : 0,
    reducers: {
        plus : (state: number, amount: number) => state + amount,
        minus: (state: number, amount: number) => state - amount,
    },
    view    : (state: number, emit: any) => {
        return f([
            h('h1', {}, [ 'Counter' ]),
            h('button', { on: { click: () => emit('plus', 1) } }, [ 'Increment' ]),
            h('p', {}, [ state.toString() ]),
            h('button', { on: { click: () => emit('minus', 1) } }, [ 'Decrement' ]),
        ]);
    },
})
    .mount(document.querySelector<HTMLElement>('#app')!);