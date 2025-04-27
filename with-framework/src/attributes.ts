import { hProps, hPropsClass, hPropsStyle } from './h.ts';
import { withoutNullsAndUndefined } from './utils/arrays.ts';


export const setAttributes = function (element: HTMLElement, attributes: hProps) {
    const { class: className, style, ...otherAttrs } = attributes;

    if (className) {
        setClass(element, className);
    }

    if (style) {
        setStyle(element, style);
    }

    for (const [ name, value ] of Object.entries(otherAttrs)) {
        setAttribute(element, name, value);
    }
};

export const setClass = function (element: HTMLElement, className: hPropsClass): void {
    element.className = '';

    if (typeof className === 'string') {
        element.className = className;
    } else if (Array.isArray(className)) {
        element.classList.add(...withoutNullsAndUndefined(className));
    } else if (typeof className === 'object') {
        // TODO: Не правильно так проверять на object, но пусть пока так
        for (const [ name, value ] of Object.entries(className)) {
            if (value) {
                element.classList.add(name);
            }
        }
    }
};

export const setStyle = function (element: HTMLElement, style: hPropsStyle): void {
    for (const [ name, value ] of Object.entries(style)) {
        // @ts-ignore TODO:
        element.style[name] = value;
    }
};

export const removeStyle = function (element: HTMLElement, name: string): void {
    // @ts-ignore TODO:
    element.style[name] = null;
};

export const setAttribute = function (element: HTMLElement, name: string, value: any): void {
    if (value === null) {
        removeAttribute(element, name);
    } else if (name.startsWith('data-')) {
        element.setAttribute(name, value);
    } else {
        // @ts-ignore TODO:
        element[name] = value;
    }
};

export const removeAttribute = function (element: HTMLElement, name: string): void {
    element.removeAttribute(name);
};