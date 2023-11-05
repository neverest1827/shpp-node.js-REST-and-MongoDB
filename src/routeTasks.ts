import {Request, Response} from "express";
import {retrieveItems, getId, getIndex} from "./functions.js";
import {Item} from "./Item.js";
import {TypeItem} from "./types.js";
import {User} from "./User.js";
import * as file from "./file_control.js";
import * as db from "./db_control.js"
import {use_db} from "./constants.js";

export async function getItems(req: Request, res: Response): Promise<void> {
    const items: Item[] = await retrieveItems(req, res);
    res.send({"items": items});
}

export async function createItem(req: Request, res: Response): Promise<void> {
    const items: Item[] = await retrieveItems(req, res);
    const request: {text: string} = req.body;
    const id: number = getId(items);
    const userID: string | undefined = req.session.login
    const newItem: Item = new Item(id, request.text, false)
    if(userID){
        if(use_db){
            await db.addItem(userID, newItem);
        } else {
            await file.addItem(userID, newItem);
        }
    } else {
        req.cookies.items.push(newItem)
        res.cookie("items", req.cookies.items)
    }
    res.status(200).send({id: id})
}

export async function editItem(req: Request, res: Response): Promise<void> {
    const items: Item[] = await retrieveItems(req, res);
    const request: TypeItem = req.body;
    const targetId: number = request.id;
    const userID: string | undefined = req.session.login
    let targetIndex: number | undefined = getIndex(items, targetId)

    if (targetIndex || targetIndex === 0) {
        if(userID){
            if(use_db){
                await db.editItem(userID, targetId, request.text, request.checked);
            } else {
                await file.editItem(userID, targetIndex, request.text, request.checked);
            }
        } else {
            req.cookies.items[targetIndex].text = request.text;
            req.cookies.items[targetIndex].checked = request.checked;
            res.cookie("items", req.cookies.items)
        }
        res.send({"ok": true});
    } else {
        res.status(409).send({"error": "item not exist"})
    }
}

export async function deleteItem(req: Request, res: Response): Promise<void> {
    const items: Item[] = await retrieveItems(req, res);
    const request: TypeItem = req.body;
    const targetId: number = request.id;
    const userID: string | undefined = req.session.login
    const startIndex: number | undefined = getIndex(items, targetId)

    if (startIndex || startIndex === 0) {
        if(userID){
            if(use_db){
                await db.deleteItem(userID, targetId);
            } else {
                await file.deleteItem(userID, startIndex);
            }
        } else {
            req.cookies.items.splice(startIndex, 1)
            res.cookie("items", req.cookies.items)
        }
        res.status(200).send({"ok": true});
    } else {
        res.status(409).send({"error": "item not exist"})
    }
}

export async function login(req: Request, res: Response): Promise<void> {
    const {login, pass} = req.body;
    const userID: string | undefined = req.session.login
    const user: User | undefined = (use_db) ? await db.getUser(login) : await file.getUser(login);

    if(userID || req.cookies?.items && !user){
        res.status(200).send({ "ok": true });
    } else {
        if (user?.login === login && user?.pass === pass){
            req.session.login = login;
            res.status(200).send({ "ok": true });
        } else {
            res.status(400).send({"error": "not found"})
        }
    }

    console.log(`route - /api/v1/login; login ${req.session.login}; sessionId ${req.session.id}; cookies ${req.cookies?.items}`)
}

export async function logout(req: Request, res: Response): Promise<void> {
    req.session.destroy((err): void => {
        if (err) {
            console.error(err);
            res.status(500).send({ "error": "Server Error" });
        } else {
            res.status(200).send({ "ok": true });
        }
    })
}

export async function register(req: Request, res: Response): Promise<void> {
    const {login, pass} = req.body;
    const userID: string | undefined = req.session.login
    const user: User | undefined = (use_db) ? await db.getUser(login) : await file.getUser(login);
    if(!user){
        if (use_db){
            await db.createUser(new User(login, pass));
        } else {
            await file.createUser(new User(login, pass));
        }
        req.session.login = login
        res.status(200).send({ "ok": true })
    } else {
        res.status(409).send({"error": "user exist"})
    }
}
