import {TypeItem} from "./types.js";
import * as fs from 'fs/promises'
import {User} from "./User.js";
import {path} from "./constants.js";
import {Item} from "./Item.js";

export async function getUser(login: string): Promise<User | undefined> {
    const data: string = await fs.readFile(path, 'utf-8')
    const db: { users: User[] } = JSON.parse(data)
    const users: User[] = db.users
    return users.find( (user: User): boolean => user.login === login )
}

export async function getItems(login: string): Promise<TypeItem[]> {
    const user: User | undefined = await getUser(login)
    if (user){
        return user.items
    } else {
        throw new Error("Can't find user in file")
    }
}

export async function addItem(login: string, item: Item): Promise<void> {
    const data: string = await fs.readFile(path, 'utf-8')
    const db: { users: User[] } = JSON.parse(data)
    const users: User[] = db.users
    const user: User | undefined = users.find( (user: User): boolean => user.login === login )

    if (user) {
        user.items.push(item)
        await fs.writeFile(path, JSON.stringify(db, null, 2))
    } else {
        throw new Error("Can't find user in file")
    }
}

export async function editItem(login:string, index: number, text: string, checked: boolean): Promise<void> {
    const data: string = await fs.readFile(path, 'utf-8')
    const db: { users: User[] } = JSON.parse(data)
    const users: User[] = db.users
    const user: User | undefined = users.find( (user: User): boolean => user.login === login )

    if (user) {
        user.items[index].text = text;
        user.items[index].checked = checked;
        await fs.writeFile(path, JSON.stringify(db, null, 2))
    } else {
        throw new Error("Can't find user in file")
    }
}

export async function deleteItem(login: string, index: number): Promise<void> {
    const data: string = await fs.readFile(path, 'utf-8')
    const db: { users: User[] } = JSON.parse(data)
    const users: User[] = db.users
    const user: User | undefined = users.find( (user: User): boolean => user.login === login )

    if (user) {
        user.items.splice(index, 1);
        await fs.writeFile(path, JSON.stringify(db, null, 2))
    } else {
        throw new Error("Can't find user in file")
    }
}

export async function createUser(user: User): Promise<void> {
    const data: string = await fs.readFile(path, 'utf-8')
    const db: { users: User[] } = JSON.parse(data)
    db.users.push(user)
    await fs.writeFile(path, JSON.stringify(db, null, 2))
}