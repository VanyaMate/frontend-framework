import { vAny, vElement, vFragment, VNODE_TYPE, vText } from './h.ts';
import { setAttributes } from './attributes.ts';
import { addEventListeners } from './events.ts';


export const insert = function (element: HTMLElement | Text, parentElement: HTMLElement, index?: number | null) {
    if (index === undefined || index === null || index < 0) {
        parentElement.append(element);
        return;
    }

    const children = parentElement.childNodes;

    if (index >= children.length) {
        parentElement.append(element);
    } else {
        parentElement.insertBefore(element, children[index]);
    }
};

export const mountDOM = function (element: HTMLElement, vDom: vAny, index?: number | null): void {
    switch (vDom.type) {
        case VNODE_TYPE.ELEMENT:
            createElementNode(element, vDom, index);
            break;
        case VNODE_TYPE.FRAGMENT:
            createFragmentNode(element, vDom, index);
            break;
        case VNODE_TYPE.TEXT:
            createTextNode(element, vDom, index);
            break;
        default:
            throw new Error(`Can't mount DOM of type: ${ vDom }`);
    }
};

export const createTextNode = function (parentElement: HTMLElement, vNode: vText, index?: number | null): void {
    insert(vNode.el = document.createTextNode(vNode.value), parentElement, index);
};

export const createElementNode = function (parentElement: HTMLElement, vNode: vElement, index?: number | null): void {
    const {
              tag,
              props: { on: events, ...attrs },
              children,
          }       = vNode;
    const element = document.createElement(tag);

    vNode.el        = element;
    vNode.listeners = addEventListeners(element, events);
    setAttributes(element, attrs);

    children.forEach((child) => mountDOM(element, child));
    insert(element, parentElement, index);
};

export const createFragmentNode = function (parentElement: HTMLElement, vNode: vFragment, index?: number | null): void {
    vNode.el = parentElement;
    vNode.children.forEach((child, i) => mountDOM(
        parentElement,
        child,
        index ? index + i : null,
    ));
};