import { describe, test, expect } from 'vitest';
import { objectsDiff } from '../src/utils/object';


describe('objectsDiff', () => {
    test('Changed user', () => {
        const oldUser = { name: 'Vanya', age: 27, from: 'Russia ' };
        const newUser = { name: 'Vanya', city: 'Moscow', from: 'Russia' };

        expect(objectsDiff(oldUser, newUser)).toEqual({
            added  : [ 'city' ],
            removed: [ 'age' ],
            updated: [ 'from' ],
        });
    });

    test('Empty object', () => {
        const oldUser = { name: 'Vanya', age: 27, from: 'Russia ' };
        const newUser = {};

        expect(objectsDiff(oldUser, newUser)).toEqual({
            added  : [],
            removed: [ 'name', 'age', 'from' ],
            updated: [],
        });
    });

    test('New object', () => {
        const oldUser = {};
        const newUser = { name: 'Vanya', age: 27, from: 'Russia ' };

        expect(objectsDiff(oldUser, newUser)).toEqual({
            added  : [ 'name', 'age', 'from' ],
            removed: [],
            updated: [],
        });
    });
});