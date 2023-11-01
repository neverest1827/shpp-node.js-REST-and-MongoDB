import {Request, Response} from "express";
import {retrieveItems, getId, getIndex} from "./functions.js";
import {Item} from "./Item.js";
import {TypeItem} from "./types.js";
import {iUser} from "./interfaces";
import {User} from "./User";
import {createUser, getUser, isUserExist, updateItems} from "./db_control";

export async function getItems(req: Request, res: Response): Promise<void> {
    const items: Item[] = await retrieveItems(req);
    res.send({"items": items});
}

export async function setItem(req: Request, res: Response): Promise<void> {
    const items: Item[] = await retrieveItems(req);
    const request: {text: string} = req.body;
    const id: number = getId(items);

    items.push(new Item(id, request.text, false));
    res.send({id: id})
}

export async function updateItem(req: Request, res: Response): Promise<void> {
    const items: Item[] = await retrieveItems(req);
    const request: TypeItem = req.body;
    const targetId: number = request.id;
    let targetIndex: number | undefined = getIndex(items, targetId)

    if (targetIndex || targetIndex === 0) {
        items[targetIndex].text = request.text;
        items[targetIndex].checked = request.checked;
        res.send({"ok": true});
    }
}

export async function deleteItem(req: Request, res: Response): Promise<void> {
    const items: TypeItem[] = await retrieveItems(req);
    const request: {id: number} = req.body;
    const targetId: number = request.id
    const startIndex: number | undefined = getIndex(items, targetId)

    if (startIndex || startIndex === 0) {
        items.splice(startIndex, 1)
        res.send({"ok": true})
    }
}

export async function login(req: Request, res: Response): Promise<void> {
    const {login, pass} = req.body;
    const user: iUser | undefined = req.session.user

    if(user){
        res.send({ "ok": true });
    } else {
        const user: User = await getUser(login);
        if (user.login === login && user.pass === pass){
            req.session.user = user;
            res.send({ "ok": true });
        } else {
            res.status(400).send({"error": "not found"})
        }
    }

    console.log(`route - /api/v1/login; login ${req.session.user?.login}; sessionId ${req.session.id}`)
}

export async function logout(req: Request, res: Response): Promise<void> {
    const user: iUser | undefined = req.session.user

    if(user && await isUserExist(user.login)){
        await updateItems(user.login, user.items)
    } else if (user) {
        await createUser(user)
    } else {
        console.log('Будут кукисы')
    }

    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            res.status(500).send({ "error": "Server Error" });
        } else {
            res.send({ "ok": true });
        }
    })
}

export async function register(req: Request, res: Response): Promise<void> {
    const {login, pass} = req.body;
    const userExist: boolean = await isUserExist(login);

    if(!userExist){
        console.log("Создал сессию")
        req.session.user = new User(login, pass)
        res.send({ "ok": true })
    } else {
        res.status(400).send({"error": "user exist use login"})
    }
}

