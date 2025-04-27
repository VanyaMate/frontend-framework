import { withoutNullsAndUndefined } from './utils/arrays.ts';
import { vNodeListeners } from './events.ts';


export enum VNODE_TYPE {
    TEXT     = 'text',
    ELEMENT  = 'element',
    FRAGMENT = 'fragment',
}

export type hTag = string;
export type hPropsClass =
    string
    | Array<string | null | undefined>
    | Record<string, boolean>;

export type hPropsStyle = Omit<CSSStyleDeclaration, 'getPropertyPriority' | 'getPropertyValue' | 'item' | 'removeProperty' | 'setProperty' | 'length' | 'parentRule'>;

export type hProps =
    Record<string, any>
    & {
        class?: hPropsClass;
        style?: hPropsStyle;
    };

export type hChildren = Array<vAny | string | null>;
export type vChildren = Array<vAny>;
export type vAny =
    vText
    | vElement
    | vFragment;

export type vNode = {
    el?: HTMLElement | Text;
}

export type vText =
    {
        type: VNODE_TYPE.TEXT,
        value: string,
    }
    & vNode;

export type vElement =
    {
        type: VNODE_TYPE.ELEMENT,
        tag: hTag,
        props: hProps,
        children: vChildren,
        listeners?: vNodeListeners;
    }
    & vNode;
export type vFragment =
    {
        type: VNODE_TYPE.FRAGMENT,
        children: vChildren,
    }
    & vNode;

export const hChildrenToVChildren = function (children: hChildren): vChildren {
    return withoutNullsAndUndefined(children)
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
        type     : VNODE_TYPE.ELEMENT,
        children : hChildrenToVChildren(children),
        tag,
        props,
        listeners: {},
    };
};