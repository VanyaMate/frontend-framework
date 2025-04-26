export const withoutNullsAndUndefined = function <T> (array: Array<T | null | undefined>): Array<T> {
    return array.filter((item) => item !== null && item !== undefined);
};