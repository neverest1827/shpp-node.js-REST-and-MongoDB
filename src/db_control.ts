import {Collection, Document, MongoClient, ServerApiVersion, WithId} from "mongodb";
import {User} from "./User.js";
import {Item} from "./Item.js";
import {TypeItem} from "./types.js";
import {db_connect_url} from "./constants.js";

const client: MongoClient = new MongoClient(db_connect_url, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
const users: Collection = client.db().collection('users');

export async function getUser(login: string): Promise<User | undefined> {
    try {
        await client.connect();
        const user: WithId<Document> | null = await users.findOne({ "login": login });
        if (user){
            return {
                login: user.login,
                pass: user.pass,
                items: user.items
            }
        }

    } finally {
        await client.close()
    }
    return undefined;
}

export async function getItems(login: string): Promise<TypeItem[]> {
    try {
        await client.connect();
        const user: WithId<Document> | null = await users.findOne({ "login": login });
        if (user) {
            return user.items;
        }
    } finally {
        await client.close()
    }
    throw new Error("Can't find user in db")
}

export async function addItem(login: string, item: Item): Promise<void> {
    try {
        await client.connect();
        await users.updateOne({"login" : login}, {$push: {"items": item}})
    } finally {
        await client.close()
    }
}

export async function editItem(login:string, id: number, text: string, checked: boolean): Promise<void> {
    try {
        await client.connect();
        await users.findOneAndUpdate(
            {"login": login, "items.id": id},
            {$set: {
                "items.$.text": text,
                "items.$.checked": checked
            }}
        )
    } finally {
        await client.close()
    }
}

export async function deleteItem(login: string, id: number): Promise<void> {
    try {
        await client.connect();
        await users.updateOne(
            {"login": login},
            { $pull: {"items": {"id": id} } }
        )
    } finally {

    }
}

export async function createUser(user: User): Promise<void> {
    try {
        await client.connect()
        await users.insertOne(user);
    } finally {
        await client.close()
    }
}
