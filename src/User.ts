import { iUser } from "./interfaces.js";
import { TypeItem } from "./types.js";

export class User implements iUser {
    login: string;
    pass: string;
    items: TypeItem[]

    constructor(login: string, pass: string, items?: TypeItem[]) {
        this.login = login;
        this.pass = pass;
        this.items = items || [];
    }
}