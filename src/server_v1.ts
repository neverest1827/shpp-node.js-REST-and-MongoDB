import express, {Express, Request, Response} from 'express';
import {fileURLToPath} from 'url';
import * as path from "path";
import bodyParser from "body-parser";
import session, {Session} from "express-session";
import FileStore from "session-file-store"

type TypePort = 3005
const port: TypePort = 3005
const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);
const FileStoreSession = FileStore(session)
const app: Express = express()

declare module 'express-session' {
    interface SessionData {
        [login: string]: iUser
    }
}

interface iUser {
    login: string;
    pass: string;
}

class User implements iUser {
    login: string;
    pass: string;

    constructor(login: string, pass: string) {
        this.login = login;
        this.pass = pass
    }
}

type TypeItem = {
    id: number,
    text: string,
    checked: boolean
}

let items: TypeItem[] = [
    { id: 22, text: "...", checked: true }
];

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(session({
    store: new FileStoreSession({
        path: "./sessions"
    }),
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 3600000} //One hour
}));


app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.get('/api/v1/items', (req: Request, res: Response) => {
    const { login } = req.session
    console.log(login)
    console.log(req.session)

    res.send({"items": items});
})

app.post('/api/v1/items', (req: Request, res: Response) => {
    const body = req.body;

    let itemId: number = 1
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
    const request = req.body;
    const targetId: number = request.id;
    let targetIndex: number | undefined

    for (let index = 0; index < items.length; index++) {
        const currentId: number = items[index].id
        if (currentId === targetId) {
            targetIndex = index
            break
        }
    }

    if (targetIndex || targetIndex === 0) {
        items[targetIndex].text = request.text;
        items[targetIndex].checked = request.checked;
        res.send({"ok": true});
    }

})

app.delete('/api/v1/items', (req: Request, res: Response) => {
    const request = req.body;
    const targetId: number = request.id
    let startIndex: number | undefined;
    for (let index = 0; index < items.length; index++) {
        const currentId: number = items[index].id
        if (currentId === targetId) {
            startIndex = index
            break
        }
    }
    if (startIndex || startIndex === 0) {
        items.splice(startIndex, 1)
        res.send({"ok": true})
    }
})

app.post('/api/v1/login', (req: Request, res: Response) => {
    const userInfo = req.body;
    const login: string = userInfo.login;
    if (
        req.session[login] &&
        req.session[login]?.login === userInfo.login &&
        req.session[login]?.pass === userInfo.pass
    ){
        res.send({"ok": true})
    } else {
        res.status(400).send({"error": "Incorrect login or password"})
    }
});

app.post('/api/v1/logout', (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            res.status(500).send({"error": "session error"});
        } else {
            // Відправлення підтвердження про завершення сесії
            res.send({ "ok": true });
        }
    });
});
app.post('/api/v1/register', (req: Request, res: Response) => {
    const userInfo = req.body;
    const login: string = userInfo.login;

    if(req.session[login]){
        res.status(400).send({"error": "This user exist"})
    } else {
        req.session[login] = new User(userInfo.login, userInfo.pass);
        res.send({"ok": true})
    }
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})