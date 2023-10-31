import {TypeItem} from "./types.js";
import * as fs from 'fs/promises'
import {User} from "./User.js";

const path: string = './db.json'

export async function isUserExist(login: string): Promise<boolean> {
    const data: string = await fs.readFile(path, 'utf-8')
    const db = JSON.parse(data)
    return db.users.find((user: User): boolean => user.login === login)
}

export async function getUser(login: string): Promise<User> {
    const data: string = await fs.readFile(path, 'utf-8')
    const db = JSON.parse(data)
    return db.users.find((user: User): User | undefined => {
        if(user.login === login){
            return user
        }
    })
}

export function getItems(userId: number): TypeItem[]{
    return []
}

export async function updateItems(login: string, items: TypeItem[]): Promise<void>{
    const data: string = await fs.readFile(path, 'utf-8')
    const db = JSON.parse(data)
    db.users.map( (user: User): void => {
        if(user.login === login){
            user.items = items;
            console.log("User update")
        }
    })
    await fs.writeFile(path, JSON.stringify(db, null, 2))
}

export async function createUser(user: User){
    const data: string = await fs.readFile(path, 'utf-8')
    const db = JSON.parse(data)
    db.users.push(user)
    await fs.writeFile(path, JSON.stringify(db, null, 2))
}