import {TypeItem} from "./types.js";
import * as fs from 'fs/promises'
import {User} from "./User.js";
import { path_to_file } from "./config.js";
import {Item} from "./Item.js";

/**
 * Retrieves a user from the file by the specified login.
 *
 * @param login the user login as string
 */
export async function getUser(login: string): Promise<User | undefined> {
    const data: string = await fs.readFile(path_to_file, 'utf-8')
    const db: { users: User[] } = JSON.parse(data)
    const users: User[] = db.users
    return users.find( (user: User): boolean => user.login === login )
}

/**
 * Gets the list of items for the user with the specified login from the file
 *
 * @param login the user login as string
 */
export async function getItems(login: string): Promise<TypeItem[]> {
    const user: User | undefined = await getUser(login)
    if (user){
        return user.items
    } else {
        throw new Error("Can't find user in file")
    }
}

/**
 * Adds a new element by user login to the file
 *
 * @param login the user login as string
 * @param item the element that needs to be added
 */
export async function addItem(login: string, item: Item): Promise<void> {
    const data: string = await fs.readFile(path_to_file, 'utf-8')
    const db: { users: User[] } = JSON.parse(data)
    const users: User[] = db.users
    const user: User | undefined = users.find( (user: User): boolean => user.login === login )

    if (user) {
        user.items.push(item)
        await fs.writeFile(path_to_file, JSON.stringify(db, null, 2), { flag: 'w' });
    } else {
        throw new Error("Can't find user in file")
    }
}

/**
 * Updates the data of the selected item
 *
 * @param login the user login as string
 * @param index index of the element to be changed
 * @param text the new text for the item
 * @param checked the new status for the item
 */
export async function editItem(login:string, index: number, text: string, checked: boolean): Promise<void> {
    const data: string = await fs.readFile(path_to_file, 'utf-8')
    const db: { users: User[] } = JSON.parse(data)
    const users: User[] = db.users
    const user: User | undefined = users.find( (user: User): boolean => user.login === login )

    if (user) {
        user.items[index].text = text;
        user.items[index].checked = checked;
        await fs.writeFile(path_to_file, JSON.stringify(db, null, 2), { flag: 'w' });
    } else {
        throw new Error("Can't find user in file")
    }
}

/**
 * Deletes the selected item
 *
 * @param login the user login as string
 * @param index the identifier of the item to be deleted
 */
export async function deleteItem(login: string, index: number): Promise<void> {
    const data: string = await fs.readFile(path_to_file, 'utf-8')
    const db: { users: User[] } = JSON.parse(data)
    const users: User[] = db.users
    const user: User | undefined = users.find( (user: User): boolean => user.login === login )

    if (user) {
        user.items.splice(index, 1);
        await fs.writeFile(path_to_file, JSON.stringify(db, null, 2), { flag: 'w' });
    } else {
        throw new Error("Can't find user in file")
    }
}

/**
 * Creates a new taper record in the file
 *
 * @param user the object with information about the user
 */
export async function createUser(user: User): Promise<void> {
    const data: string = await fs.readFile(path_to_file, 'utf-8')
    const db: { users: User[] } = JSON.parse(data)
    db.users.push(user)
    await fs.writeFile(path_to_file, JSON.stringify(db, null, 2), { flag: 'w' });
}
