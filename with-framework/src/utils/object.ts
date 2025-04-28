export type ObjectsDiff = {
    added: Array<string>;
    removed: Array<string>;
    updated: Array<string>;
}

export const objectsDiff = function (oldObj: Record<any, any>, newObj: Record<any, any>): ObjectsDiff {
    const oldKeys                = Object.keys(oldObj);
    const newKeys                = Object.keys(newObj);
    const added: Array<string>   = [];
    const removed: Array<string> = oldKeys.filter((key) => !(key in newObj));
    const updated: Array<string> = [];

    for (const key of newKeys) {
        if (key in oldObj) {
            if (oldObj[key] !== newObj[key]) {
                updated.push(key);
            }
        } else {
            added.push(key);
        }
    }

    return { added, removed, updated };
};