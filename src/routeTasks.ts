import {Request, Response} from "express";
import {retrieveItems, getId, getIndex} from "./functions.js";
import {Item} from "./Item.js";
import {TypeItem} from "./types.js";
import {User} from "./User.js";
import * as file from "./file_control.js";
import * as db from "./db_control.js"
import {use_db} from "./config.js";

/**
 * Processes an HTTP request for custom elements and sends them as a JSON response.
 *
 * @param req Express Request object containing information about the incoming HTTP request.
 * @param res Express Response object used to send the HTTP response back to the client.
 */
export async function getItems(req: Request, res: Response): Promise<void> {
    const items: Item[] = await retrieveItems(req, res);
    res.send({"items": items});
}

/**
 * Processes an HTTP request to create an element for a user and sends a response as a JSON response.
 *
 * @param req Express Request object containing information about the incoming HTTP request.
 * @param res Express Response object used to send the HTTP response back to the client.
 */
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

/**
 * Processes HTTP requests to change information in the selected user element and sends a response in the form of
 * a JSON response.
 *
 * @param req Express Request object containing information about the incoming HTTP request.
 * @param res Express Response object used to send the HTTP response back to the client.
 */
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

/**
 * Processes an HTTP request to delete an item for the user and sends a response as a JSON response.
 *
 * @param req Express Request object containing information about the incoming HTTP request.
 * @param res Express Response object used to send the HTTP response back to the client.
 */
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

/**
 * Processes an HTTP request for user authorization, creates a session, and sends a JSON response.
 *
 * @param req Express Request object containing information about the incoming HTTP request.
 * @param res Express Response object used to send the HTTP response back to the client.
 */
export async function login(req: Request, res: Response): Promise<void> {
    const {login, pass} = req.body;
    const userID: string | undefined = req.session.login
    const user: User | undefined = (use_db) ? await db.getUser(login) : await file.getUser(login);

    if(userID){
        res.status(200).send({ "ok": true });
    } else {
        if (user?.login === login && user?.pass === pass){
            req.session.login = login;
            res.status(200).send({ "ok": true });
        } else {
            res.status(400).send({"error": "not found"})
        }
    }
}

/**
 * Processes an HTTP request for user logout, deletes the session, and sends a JSON response.
 *
 * @param req Express Request object containing information about the incoming HTTP request.
 * @param res Express Response object used to send the HTTP response back to the client.
 */
export async function logout(req: Request, res: Response): Promise<void> {
    req.session.destroy((err): void => {
        if (err) {
            console.error(err);
            res.status(500).send({ "error": "Server Error" });
        } else {
            res.clearCookie('connect.sid') // Delete cookies with the session key to avoid getting an error
            res.status(200).send({ "ok": true });
        }
    })
}

/**
 * Processes an HTTP request for user registration, creates a session, and sends a JSON response.
 *
 * @param req Express Request object containing information about the incoming HTTP request.
 * @param res Express Response object used to send the HTTP response back to the client.
 */
export async function register(req: Request, res: Response): Promise<void> {
    const {login, pass} = req.body;
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
