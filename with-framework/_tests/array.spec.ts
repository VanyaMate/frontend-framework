import { describe, expect, test } from 'vitest';
import {
    ARRAY_DIFF_OP,
    arrayDiffSequence,
    arraysDiff,
} from '../src/utils/arrays';


describe('arraysDiff', () => {
    test('Two array', () => {
        const classes    = [ 'first', 'second' ];
        const newClasses = [ 'first', 'third' ];

        expect(arraysDiff(classes, newClasses)).toEqual({
            added  : [ 'third' ],
            removed: [ 'second' ],
        });
    });
});

describe('arrayDiffSequence', () => {
    test('Two array', () => {
        const oldArray = [ 'a', 'b', 'c' ];
        const newAray  = [ 'b', 'a' ];
        const eqFn     = (a: string, b: string): boolean => a === b;

        const sequence = arrayDiffSequence(oldArray, newAray, eqFn);

        expect(sequence.length).toEqual(3);
        expect(sequence).toEqual([
            {
                op           : ARRAY_DIFF_OP.MOVE,
                item         : 'b',
                originalIndex: 1,
                from         : 1,
                index        : 0,
            },
            {
                op           : ARRAY_DIFF_OP.NOOP,
                item         : 'a',
                originalIndex: 0,
                index        : 1,
            },
            {
                op   : ARRAY_DIFF_OP.REMOVE,
                item : 'c',
                index: 2,
            },
        ]);
    });
});