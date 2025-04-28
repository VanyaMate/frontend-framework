import { vAny, VNODE_TYPE } from './h.ts';


export const patchDOM = function (vDom: vAny, newVDom: vAny, parentElement: HTMLElement): vAny {
    console.log(vDom, newVDom, parentElement);

    return {
        type : VNODE_TYPE.TEXT,
        value: 'text',
    };
};