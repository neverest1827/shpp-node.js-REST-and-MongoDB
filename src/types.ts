import {Request, Response} from "express";

/**
 * Represents the structure of an item in the app
 */
export type TypeItem = {
    id: number,
    text: string,
    checked: boolean
}

/**
 * Defines a type representing various actions in the application.
 */
export type TypeActions = {
    [key: string]: (req: Request, res: Response) => Promise<void>;
}