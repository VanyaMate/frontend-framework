import { vAny, vElement, vFragment, VNODE_TYPE, vText } from './h.ts';
import { setAttributes } from './attributes.ts';
import { addEventListeners } from './events.ts';


export const mountDOM = function (element: HTMLElement, vdom: vAny): void {
    switch (vdom.type) {
        case VNODE_TYPE.ELEMENT:
            createElementNode(element, vdom);
            break;
        case VNODE_TYPE.FRAGMENT:
            createFragmentNode(element, vdom);
            break;
        case VNODE_TYPE.TEXT:
            createTextNode(element, vdom);
            break;
        default:
            throw new Error(`Can't mount DOM of type: ${ vdom }`);
    }
};

export const createTextNode = function (parentElement: HTMLElement, vNode: vText): void {
    parentElement.append(vNode.el = document.createTextNode(vNode.value));
};

export const createElementNode = function (parentElement: HTMLElement, vNode: vElement): void {
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
    parentElement.appendChild(element);
};

export const createFragmentNode = function (parentElement: HTMLElement, vNode: vFragment): void {
    vNode.el = parentElement;
    vNode.children.forEach((child) => mountDOM(parentElement, child));
};