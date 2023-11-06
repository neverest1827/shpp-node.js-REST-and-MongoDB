import {TypeItem} from "./types.js";
import {Request, Response} from "express";
import {Item} from "./Item.js";
import * as file from "./file_control.js"
import * as db from "./db_control.js"
import {use_db} from "./config.js";

/**
 * Finds the required element in the array by its identifier and returns its index
 *
 * @param items is an array of elements in which the search will be performed
 * @param targetId the identifier by which the search will be performed
 */
export function getIndex(items: Item[], targetId: number): number | undefined{
    for (let index: number = 0; index < items.length; index++) {
        const currentId: number = items[index].id
        if (currentId === targetId) {
            return index
        }
    }
    return undefined;
}

/**
 * Receives user items depending on the specified conditions
 *
 * @param req - Express Request object containing information about the incoming HTTP request.
 * @param res - Express Response object used to send the HTTP response back to the client.
 */
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
        if (req.cookies.items) {
            items = req.cookies.items
        } else {
            res.cookie("items", [])
            items = [] // Since we will receive cookies only on the next request, I use the following "crutch"
        }
    }

    return items
}

/**
 * Creates unique identifiers for elements
 *
 * @param items is an array of elements
 */
export function getId(items: TypeItem[]): number{
    let id: number = 1;
    if (items.length > 0) {
        const lastIndex: number = items.length - 1;
        id = items[lastIndex].id + 1;
    }
    return id
}