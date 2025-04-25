export const withoutNulls = function <T> (array: Array<T | null>): Array<T> {
    return array.filter((item) => item !== null);
};