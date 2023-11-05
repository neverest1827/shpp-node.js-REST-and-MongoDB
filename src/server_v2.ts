import express, {Express, Request, Response} from 'express';
import { fileURLToPath } from 'url';
import * as path from "path";
import bodyParser from "body-parser";
import session from "express-session";
import FileStore from "session-file-store"
import { TypePort } from "./types.js";
import {actions} from "./actions.js";
import cookieParser from "cookie-parser";
import cors from "cors"

const port: TypePort = 3005
const filename: string = fileURLToPath(import.meta.url);
const dirname: string = path.dirname(filename);
const FileStoreSession = FileStore(session)
const app: Express = express()

declare module 'express-session' {
    interface SessionData {
        login: string;
    }
}

app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:63342",
    credentials: true
}));
app.use(express.static(path.join(dirname, '../public')));
app.use(session({
    store: new FileStoreSession({
        path: "./sessions"
    }),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 30 * 60 * 1000} // 30 minute
}));

app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(dirname, '../public', 'index.html'));
    console.log(req.query.action)
});


app.post('/api/v2/router', async (req: Request, res: Response): Promise<void> => {
    const actionName = req.query.action;

    if (typeof actionName === "string") {
        const requestedAction = actions[actionName]
        if (requestedAction) {
            await requestedAction(req, res);
        } else {
            res.status(400).send({"error": "Bad request"});
        }
    } else {
        res.status(400).send({"error": "Bad request"});
    }
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
