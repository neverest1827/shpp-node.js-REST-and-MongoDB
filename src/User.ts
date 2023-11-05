import { IUser } from "./interfaces.js";
import { TypeItem } from "./types.js";

/**
 * Represents a user in the app
 */
export class User implements IUser {
    login: string;
    pass: string;
    items: TypeItem[]

    constructor(login: string, pass: string, items?: TypeItem[]) {
        this.login = login;
        this.pass = pass;
        this.items = items || [];
    }
}