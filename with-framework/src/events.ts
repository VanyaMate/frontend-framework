export type vNodeListeners = Record<string, EventListener>;

export const addEventListeners = function (element: HTMLElement, listeners: vNodeListeners = {}): vNodeListeners {
    const addedListeners: vNodeListeners = {};

    Object.entries(listeners).forEach(([ listenerName, listener ]) => {
        addedListeners[listenerName] = addEventListener(element, listenerName, listener);
    });

    return addedListeners;
};

export const addEventListener = function (element: HTMLElement, eventName: string, handler: EventListener): EventListener {
    element.addEventListener(eventName, handler);
    return handler;
};

export const removeEventListeners = function (element: HTMLElement, listeners: vNodeListeners = {}) {
    Object.entries(listeners).forEach(([ listenerName, listener ]) => {
        removeEventListener(element, listenerName, listener);
    });
};

export const removeEventListener = function (element: HTMLElement, eventName: string, handler: EventListener) {
    element.removeEventListener(eventName, handler);
};