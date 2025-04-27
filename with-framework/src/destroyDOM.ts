import { vAny, vElement, vFragment, VNODE_TYPE, vText } from './h.ts';
import { removeEventListeners } from './events.ts';


export const destroyDOM = function (vdom: vAny) {
    switch (vdom.type) {
        case VNODE_TYPE.ELEMENT:
            removeElementNode(vdom);
            break;
        case VNODE_TYPE.TEXT:
            removeTextNode(vdom);
            break;
        case VNODE_TYPE.FRAGMENT:
            removeFragmentNode(vdom);
            break;
        default:
            throw new Error(`Cant destroy DOM of type: ${ vdom }`);
    }
};

export const removeTextNode = function (vNode: vText): void {
    vNode.el?.remove();
};

export const removeElementNode = function (vNode: vElement): void {
    const { el, children, listeners } = vNode;

    if (listeners && el instanceof HTMLElement) {
        removeEventListeners(el, listeners);
        delete vNode.listeners;
    }

    el?.remove();
    children.forEach(destroyDOM);
};

export const removeFragmentNode = function (vNode: vFragment): void {
    const { children } = vNode;
    children.forEach(destroyDOM);
};