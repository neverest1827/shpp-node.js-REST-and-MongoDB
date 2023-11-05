import { fileURLToPath } from "url";
import path from "path";
import FileStore from "session-file-store";
import session from "express-session";
import express, { Express } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import { cors_url } from "./config.js";


const filename: string = fileURLToPath(import.meta.url);
export const dirname: string = path.dirname(filename);
const FileStoreSession: FileStore.FileStore = FileStore(session)
export const app: Express = express()


app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors({
    origin: cors_url,
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
    cookie: {maxAge: 30 * 60 * 1000} // 30 minutes
}));