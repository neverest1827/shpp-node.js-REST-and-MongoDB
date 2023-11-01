import express, {Express, Request, Response} from 'express';
import { fileURLToPath } from 'url';
import * as path from "path";
import bodyParser from "body-parser";
import session from "express-session";
import FileStore from "session-file-store"
import { TypePort } from "./types.js";
import * as routeTasks from "./routeTasks.js"

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

app.use(bodyParser.json());
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
});

app.get('/api/v1/items', routeTasks.getItems)

app.post('/api/v1/items', routeTasks.setItem)

app.put('/api/v1/items', routeTasks.updateItem)

app.delete('/api/v1/items', routeTasks.deleteItem)

app.post('/api/v1/login',  routeTasks.login);

app.post('/api/v1/logout',  routeTasks.logout);

app.post('/api/v1/register', routeTasks.register);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
