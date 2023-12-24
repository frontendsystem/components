// a global file can be accessed from global scope, without using imports

export {}

type RequestIdleCallbackHandle = any;
type RequestIdleCallbackOptions = {
    timeout: number;
}
type RequestIdleCallbackDeadline = {
    readonly didTimeout: boolean;
    timeRemaining: () => number;
}