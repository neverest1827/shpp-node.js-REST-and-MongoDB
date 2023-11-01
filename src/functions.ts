import {TypeItem} from "./types.js";
import {Request} from "express";
import {defaultItems} from "./constants.js";
import {Item} from "./Item";

export function getIndex(items: Item[], targetId: number): number | undefined{
    for (let index: number = 0; index < items.length; index++) {
        const currentId: number = items[index].id
        if (currentId === targetId) {
            return index
        }
    }
    return undefined;
}

export async function retrieveItems(req: Request): Promise<TypeItem[]>{
    return req.session.user?.items || req.cookies?.items || defaultItems
}

export function getId(items: TypeItem[]): number{
    let id: number = 1;
    if (items.length > 0) {
        const lastIndex: number = items.length - 1;
        id = items[lastIndex].id + 1;
    }
    return id
}