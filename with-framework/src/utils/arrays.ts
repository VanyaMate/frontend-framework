export const withoutNullsAndUndefined = function <T> (array: Array<T | null | undefined>): Array<T> {
    return array.filter((item) => item !== null && item !== undefined);
};

export type ArraysDiff<Type> = {
    added: Array<Type>,
    removed: Array<Type>,
}

export const arraysDiff = function <Type> (oldArray: Array<Type>, newArray: Array<Type>): ArraysDiff<Type> {
    return {
        added  : newArray.filter((item) => !oldArray.includes(item)),
        removed: oldArray.filter((item) => !newArray.includes(item)),
    };
};

export enum ARRAY_DIFF_OP {
    ADD    = 'add',
    REMOVE = 'remove',
    MOVE   = 'move',
    NOOP   = 'noop',
}

export class ArrayWithOriginalIndices<Item> {
    private readonly _array: Array<Item>             = [];
    private readonly _originalIndices: Array<number> = [];
    private readonly _equalsFn: (a: Item, b: Item) => boolean;

    constructor (array: Array<Item>, equalsFn: (a: Item, b: Item) => boolean) {
        this._array           = array;
        this._originalIndices = array.map((_, i) => i);
        this._equalsFn        = equalsFn;
    }

    get length () {
        return this._array.length;
    }

    originalIndexAt (index: number): number {
        return this._originalIndices[index];
    }

    isRemoval (index: number, newArray: Array<Item>): boolean {
        if (index >= this._array.length) {
            return false;
        }

        const item            = this._array[index];
        const indexInNewArray = newArray.findIndex((newItem) => this._equalsFn(item, newItem));
        return indexInNewArray === -1;
    }

    isNoop (index: number, newArray: Array<Item>): boolean {
        if (index >= this._array.length) {
            return false;
        }

        const item    = this._array[index];
        const newItem = newArray[index];
        return this._equalsFn(item, newItem);
    }

    isAddition (item: Item, fromIndex: number): boolean {
        return this.findIndexFrom(item, fromIndex) === -1;
    }

    findIndexFrom (item: Item, fromIndex: number): number {
        for (let i = fromIndex; i < this.length; i++) {
            if (this._equalsFn(item, this._array[i])) {
                return i;
            }
        }

        return -1;
    }

    addItem (item: Item, index: number): DiffSequenceAdd<Item> {
        const operation: DiffSequenceAdd<Item> = {
            op: ARRAY_DIFF_OP.ADD,
            index,
            item,
        };

        this._array.splice(index, 0, item);
        this._originalIndices.splice(index, 0, -1);

        return operation;
    }

    removeItem (index: number): DiffSequenceRemove<Item> {
        const operation: DiffSequenceRemove<Item> = {
            op  : ARRAY_DIFF_OP.REMOVE,
            index,
            item: this._array[index],
        };

        this._array.splice(index, 1);
        this._originalIndices.splice(index, 1);
        return operation;
    }

    noopItem (index: number): DiffSequenceNoop<Item> {
        return {
            op           : ARRAY_DIFF_OP.NOOP,
            originalIndex: this.originalIndexAt(index),
            index,
            item         : this._array[index],
        };
    }

    moveItem (item: Item, toIndex: number): DiffSequenceMove<Item> {
        const fromIndex                         = this.findIndexFrom(item, toIndex);
        const operation: DiffSequenceMove<Item> = {
            op           : ARRAY_DIFF_OP.MOVE,
            originalIndex: this.originalIndexAt(fromIndex),
            from         : fromIndex,
            index        : toIndex,
            item         : this._array[fromIndex],
        };
        const [ _item ]                         = this._array.splice(fromIndex, 1);
        this._array.splice(toIndex, 0, _item);
        const [ originalIndex ] = this._originalIndices.splice(fromIndex, 1);
        this._originalIndices.splice(toIndex, 0, originalIndex);

        return operation;
    }

    removeItemsAfter (index: number) {
        const operations: Array<DiffSequenceRemove<Item>> = [];

        while (this.length > index) {
            operations.push(this.removeItem(index));
        }

        return operations;
    }
}


export type DiffSequenceAdd<Item> =
    {
        op: ARRAY_DIFF_OP.ADD,
        item: Item,
        index: number,
    };

export type DiffSequenceRemove<Item> =
    {
        op: ARRAY_DIFF_OP.REMOVE,
        item: Item,
        index: number,
    }

export type DiffSequenceMove<Item> =
    {
        op: ARRAY_DIFF_OP.MOVE,
        item: Item,
        originalIndex: number,
        from: number,
        index: number,
    }

export type DiffSequenceNoop<Item> =
    {
        op: ARRAY_DIFF_OP.NOOP,
        item: Item,
        originalIndex: number,
        index: number,
    }
export type DiffSequenceAny<Item> =
    DiffSequenceAdd<Item>
    | DiffSequenceRemove<Item>
    | DiffSequenceMove<Item>
    | DiffSequenceNoop<Item>;

export const arrayDiffSequence = function <Item> (oldArray: Array<Item>, newArray: Array<Item>, equalsFn: (a: Item, b: Item) => boolean) {
    const sequence: Array<DiffSequenceAny<Item>> = [];
    const array                                  = new ArrayWithOriginalIndices<Item>(oldArray, equalsFn);

    for (let i = 0; i < newArray.length; i++) {
        if (array.isRemoval(i, newArray)) {
            sequence.push(array.removeItem(i));
            i -= 1;
            continue;
        }

        if (array.isNoop(i, newArray)) {
            sequence.push(array.noopItem(i));
            continue;
        }

        const item = newArray[i];
        if (array.isAddition(item, i)) {
            sequence.push(array.addItem(item, i));
            continue;
        }

        sequence.push(array.moveItem(item, i));
    }

    sequence.push(...array.removeItemsAfter(newArray.length));

    return sequence;
};