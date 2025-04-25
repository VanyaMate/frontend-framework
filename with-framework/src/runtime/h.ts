import { withoutNulls } from './utils/arrays.ts';


export enum VNODE_TYPE {
    TEXT     = 'text',
    ELEMENT  = 'element',
    FRAGMENT = 'fragment',
}

export type hTag = string;
export type hProps = Record<string, any>;
export type hChildren = Array<vAny | string | null>;
export type vChildren = Array<vAny>;
export type vAny =
    vText
    | vElement
    | vFragment;

export type vText = {
    type: VNODE_TYPE.TEXT,
    value: string,
}
export type vElement = {
    type: VNODE_TYPE.ELEMENT,
    tag: hTag,
    props: hProps,
    children: vChildren,
}
export type vFragment = {
    type: VNODE_TYPE.FRAGMENT,
    children: vChildren,
}

export const hChildrenToVChildren = function (children: hChildren): vChildren {
    return withoutNulls(children)
        .map(
            (child) => typeof child === 'string' ? t(child) : child,
        );
};

export const t = function (text: string): vText {
    return {
        type : VNODE_TYPE.TEXT,
        value: text,
    };
};

export const f = function (children: hChildren): vFragment {
    return {
        type    : VNODE_TYPE.FRAGMENT,
        children: hChildrenToVChildren(children),
    };
};

export const h = function (tag: hTag, props: hProps = {}, children: hChildren = []): vElement {
    return {
        type    : VNODE_TYPE.ELEMENT,
        children: hChildrenToVChildren(children),
        tag,
        props,
    };
};