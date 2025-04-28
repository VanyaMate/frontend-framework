import { describe, test, expect } from 'vitest';
import { arraysDiff } from '../src/utils/arrays';


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