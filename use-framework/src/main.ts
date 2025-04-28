import { createApp, Emit, f, h, Reducers } from '@vanyamate/framework';


type AppStateEdit = {
    idx: null | number,
    original: null | string,
    edited: null | string,
};

type AppState = {
    currentTodo: string,
    edit: AppStateEdit,
    todo: Array<string>
}

const state: AppState = {
    currentTodo: '',
    edit       : {
        idx     : null,
        original: null,
        edited  : null,
    },
    todo       : [],
};

const reducers = {
    'update-current-todo': (state: AppState, currentTodo: string | null) => ({
        ...state, currentTodo: currentTodo ?? '',
    }),
    'add-todo'           : (state: AppState) => ({
        ...state,
        currentTodo: '',
        todo       : state.todo.concat(state.currentTodo),
    }),
    'start-editing-todo' : (state: AppState, idx: number) => ({
        ...state,
        edit: {
            idx,
            original: state.todo[idx],
            edited  : state.todo[idx],
        },
    }),
    'edit-todo'          : (state: AppState, edited: string) => ({
        ...state,
        edit: { ...state.edit, edited },
    }),
    'save-edited-todo'   : (state: AppState) => {
        if (state.edit.idx !== null && state.edit.edited) {
            const todo           = [ ...state.todo ];
            todo[state.edit.idx] = state.edit.edited;

            return {
                ...state,
                edit: {
                    idx     : null,
                    original: null,
                    edited  : null,
                },
                todo,
            };
        }

        return {
            ...state,
            edit: {
                idx     : null,
                original: null,
                edited  : null,
            },
        };
    },
    'cancel-editing-todo': (state: AppState) => ({
        ...state,
        edit: {
            idx     : null,
            original: null,
            edited  : null,
        },
    }),
    'remove-todo'        : (state: AppState, idx: number) => ({
        ...state,
        todo: state.todo.toSpliced(idx, 1),
    }),
} satisfies Reducers<typeof state>;

const CreateTodo = function (state: AppState, emit: Emit<typeof reducers>) {
    return h('div', {}, [
        h('label', { for: 'todo-input' }, [ 'New todo' ]),
        h('input', {
            type : 'text',
            id   : 'todo-input',
            value: state.currentTodo,
            on   : {
                input  : ({ target }: {
                    target: HTMLInputElement
                }) => emit('update-current-todo', target.value),
                keydown: ({ key }: {
                    key: string
                }) => key === 'Enter' && state.currentTodo.length >= 3 && emit('add-todo'),
            },
        }),
        h('button', {
            disabled: state.currentTodo.length < 3,
            on      : { click: () => emit('add-todo') },
        }, [ 'add' ]),
    ]);
};

const TodoItem = function ({ todo, i, edit }: {
    todo: string,
    i: number,
    edit: AppStateEdit
}, emit: Emit<typeof reducers>) {
    const editing = edit.idx === i;

    if (editing) {
        return h('li', {}, [
            h('input', {
                value: edit.edited,
                on   : {
                    input: ({ target }: {
                        target: HTMLInputElement
                    }) => emit('edit-todo', target.value),
                },
            }),
            h('button', {
                on: {
                    click: () => emit('save-edited-todo'),
                },
            }, [ 'save' ]),
            h('button', {
                on: {
                    click: () => emit('cancel-editing-todo'),
                },
            }, [ 'cancel' ]),
        ]);
    } else {
        return h('li', {}, [
            h('span', {
                on: {
                    dblclick: () => emit('start-editing-todo', i),
                },
            }, [ todo ]),
            h('button', {
                on: {
                    click: () => emit('remove-todo', i),
                },
            }, [ 'done' ]),
        ]);
    }
};

const TodoList = function (state: AppState, emit: Emit<typeof reducers>) {
    return h(
        'ol',
        {},
        state.todo.map((todo, i) => (
            TodoItem(
                { todo, i, edit: state.edit },
                emit,
            )
        )),
    );
};

const App = function (state: AppState, emit: Emit<typeof reducers>) {
    return f([
        h('h1', {}, [ 'My todo' ]),
        CreateTodo(state, emit),
        TodoList(state, emit),
    ]);
};

createApp({
    state, reducers, view: App,
}).mount(document.getElementById('app')!);