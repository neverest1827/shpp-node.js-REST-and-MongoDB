import { Request, Response} from 'express';
import * as path from "path";
import * as tasks from "./routeTasks.js";
import { port } from "./config.js";
import { app, dirname } from "./app.js";

app.get('/', (req: Request, res: Response): void => {
    res.sendFile(path.join(dirname, '../public', 'index.html'));
});

app.get('/api/v1/items', tasks.getItems)

app.post('/api/v1/items', tasks.createItem)

app.put('/api/v1/items', tasks.editItem)

app.delete('/api/v1/items', tasks.deleteItem)

app.post('/api/v1/login',  tasks.login);

app.post('/api/v1/logout',  tasks.logout);

app.post('/api/v1/register', tasks.register);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
