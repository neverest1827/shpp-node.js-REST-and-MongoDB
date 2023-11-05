import {TypeItem} from "./types.js";
import {Request, Response} from "express";
import {Item} from "./Item.js";
import * as file from "./file_control.js"
import * as db from "./db_control.js"
import {use_db} from "./constants.js";

export function getIndex(items: Item[], targetId: number): number | undefined{
    for (let index: number = 0; index < items.length; index++) {
        const currentId: number = items[index].id
        if (currentId === targetId) {
            return index
        }
    }
    return undefined;
}

export async function retrieveItems(req: Request, res: Response): Promise<TypeItem[]>{
    let items: Item[];
    const userID: string | undefined = req.session.login
    if (userID) {
        if(use_db) {
            items = await db.getItems(userID);
        } else {
            items = await file.getItems(userID);
        }
    } else {
        if (!req.cookies?.items) {
            res.cookie("items", [])
            items = []
        } else {
            items = req.cookies.items
        }
    }

    return items
}

export function getId(items: TypeItem[]): number{
    let id: number = 1;
    if (items.length > 0) {
        const lastIndex: number = items.length - 1;
        id = items[lastIndex].id + 1;
    }
    return id
}