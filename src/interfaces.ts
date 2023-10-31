import { TypeItem } from "./types.js";

export interface iUser {
    login: string;
    pass: string;
    items: TypeItem[]
}