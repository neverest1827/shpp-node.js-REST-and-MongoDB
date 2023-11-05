import {TypeItem} from "./types.js";

/**
 * Represents an item in the app
 */
export class Item implements TypeItem {
    id: number;
    text: string;
    checked: boolean;

    constructor(id: number, text: string, checked: boolean) {
        this.id = id;
        this.text = text;
        this.checked = checked;
    }
}