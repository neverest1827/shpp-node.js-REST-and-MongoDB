import {Request, Response} from "express";

export type TypeItem = {
    id: number,
    text: string,
    checked: boolean
}

export type TypePort = 3005

export type TypeActions = {
    [key: string]: (req: Request, res: Response) => Promise<void>;
}