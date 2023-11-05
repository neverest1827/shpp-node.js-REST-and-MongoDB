import { TypeItem } from "./types.js";

/**
 * Interface representing the structure of a user in the app
 */
export interface IUser {
    login: string;
    pass: string;
    items: TypeItem[]
}

// Complements the 'express-session' module by extending the 'SessionData' interface. In order for the compiler not to
// quarrel with a non-existent property
declare module 'express-session' {
    interface SessionData {
        login: string;
    }
}