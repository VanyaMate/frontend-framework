import { f, h, vFragment } from '../h.ts';


export const lipsum = function (count: number): vFragment {
    return f(new Array(count).fill(h('p', {}, [ `Lorem ipsum dolor sitamet, consectetur adipiscing elit` ])));
};