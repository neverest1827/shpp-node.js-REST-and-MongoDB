import express, {Express, Request, Response} from 'express';
import {fileURLToPath} from 'url';
import * as path from "path";
import bodyParser from "body-parser";
import session from "express-session";
import FileStore from "session-file-store"
import { User } from "./User.js";
import { iUser } from "./interfaces.js";
import { TypeItem, TypePort } from "./types.js";
import {getIndex} from "./functions.js";
import {createUser, getUser, isUserExist, updateItems} from "./db_control.js";


const port: TypePort = 3005
const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);
const FileStoreSession = FileStore(session)
const app: Express = express()

declare module 'express-session' {
    interface SessionData {
        user: iUser;
    }
}

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(session({
    store: new FileStoreSession({
        path: "./sessions"
    }),
    // secret: Date.now().toString(),
    secret: 'keyboard cat',
    // rolling: true,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 30 * 60 * 1000} // 30 minute
}));

const defaultItems: TypeItem[] = [];

app.get('/', (req: Request, res: Response) => {
    console.log(`route - /; login ${req.session.user?.login}; sessionId ${req.session.id}`)

    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.get('/api/v1/items', (req: Request, res: Response) => {
    console.log(`route - get/api/v1/items; login ${req.session.user?.login}; sessionId ${req.session.id}`)

    const items: TypeItem[] = req.session.user?.items || defaultItems
    res.send({"items": items});
})

app.post('/api/v1/items', (req: Request, res: Response) => {
    console.log(`route - post/api/v1/items; login ${req.session.user?.login}; sessionId ${req.session.id}`)
    const body = req.body;
    const items: TypeItem[] = req.session.user?.items || defaultItems

    let itemId: number = 1;
    if (items.length > 0) {
        const lastIndex: number = items.length - 1;
        itemId = items[lastIndex].id + 1;
    }

    const newItem: TypeItem = {
        id: itemId,
        text: body.text,
        checked: false
    }

    items.push(newItem);
    res.send({id: itemId})
})

app.put('/api/v1/items', (req: Request, res: Response) => {
    const items: TypeItem[] = defaultItems
    const request = req.body;
    const targetId: number = request.id;
    let targetIndex: number | undefined = getIndex(items, targetId)

    if (targetIndex || targetIndex === 0) {
        items[targetIndex].text = request.text;
        items[targetIndex].checked = request.checked;
        res.send({"ok": true});
    }
})

app.delete('/api/v1/items', (req: Request, res: Response) => {
    const items: TypeItem[] = req.session.user?.items || defaultItems
    const request = req.body;
    const targetId: number = request.id
    let startIndex: number | undefined = getIndex(items, targetId)
    if (startIndex || startIndex === 0) {
        items.splice(startIndex, 1)
        res.send({"ok": true})
    }
})

app.post('/api/v1/login',  async (req: Request, res: Response) => {
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
});

app.post('/api/v1/logout',  async (req: Request, res: Response) => {
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
            res.clearCookie('connect.sid');
            res.send({ "ok": true });
        }
    })
});
app.post('/api/v1/register', async (req: Request, res: Response) => {
    const {login, pass} = req.body;
    const userExist: boolean = await isUserExist(login);

    if(!userExist){
        console.log("Создал сессию")
        req.session.user = new User(login, pass)
        res.send({ "ok": true })
    } else {
        res.status(400).send({"error": "user exist? use login"})
    }
    console.log(`route - /api/v1/register; login ${req.session.user?.login}; sessionId ${req.session.id}`)
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})