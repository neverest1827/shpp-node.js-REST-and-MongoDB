import { Request, Response } from 'express';
import * as path from "path";
import { actions } from "./actions.js";
import { app, dirname } from "./app.js";
import { port } from "./config.js";

app.get('/', (req: Request, res: Response): void => {
    res.sendFile(path.join(dirname, '../public', 'index.html'));
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


app.listen(port, (): void => {
    console.log(`Example app listening on port ${port}`)
})
