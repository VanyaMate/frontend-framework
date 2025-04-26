export const addEventListeners = function (element: HTMLElement, listeners: Record<string, EventListener> = {}) {
    const addedListeners: Record<string, EventListener> = {};

    Object.entries(listeners).forEach(([ listenerName, listener ]) => {
        addedListeners[listenerName] = addEventListener(element, listenerName, listener);
    });

    return addedListeners;
};

export const addEventListener = function (element: HTMLElement, eventName: string, handler: EventListener): EventListener {
    element.addEventListener(eventName, handler);
    return handler;
};