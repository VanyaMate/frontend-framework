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