import {Collection, Document, MongoClient, ServerApiVersion, WithId} from "mongodb";
import { User } from "./User.js";
import { Item} from "./Item.js";
import { TypeItem } from "./types.js";
import { db_connect_url } from "./config.js";

const client: MongoClient = new MongoClient(db_connect_url, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
const users: Collection = client.db().collection('users');

/**
 * Retrieves a user from the database by the specified login.
 *
 * @param login the user login as string
 */
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

/**
 * Gets the list of items for the user with the specified login from the database
 *
 * @param login the user login as string
 */
export async function getItems(login: string): Promise<Item[]> {
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

/**
 * Adds a new element by user login to the database
 *
 * @param login the user login as string
 * @param item the element that needs to be added
 */
export async function addItem(login: string, item: TypeItem): Promise<void> {
    try {
        await client.connect();
        await users.updateOne({"login" : login}, {$push: {"items": item}})
    } finally {
        await client.close()
    }
}

/**
 * Updates the data of the selected item
 *
 * @param login the user login as string
 * @param id the identifier of the item to be updated
 * @param text the new text for the item
 * @param checked the new status for the item
 */
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

/**
 * Deletes the selected item
 *
 * @param login the user login as string
 * @param id the identifier of the item to be deleted
 */
export async function deleteItem(login: string, id: number): Promise<void> {
    try {
        await client.connect();
        await users.updateOne(
            {"login": login},
            { $pull: {"items": {"id": id} } }
        )
    } finally {
        await client.close()
    }
}

/**
 * Creates a new taper record in the database
 *
 * @param user the object with information about the user
 */
export async function createUser(user: User): Promise<void> {
    try {
        await client.connect()
        await users.insertOne(user);
    } finally {
        await client.close()
    }
}
