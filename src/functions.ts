import {TypeItem} from "./types.js";

export function getIndex(items: TypeItem[], targetId: number): number | undefined{
    for (let index: number = 0; index < items.length; index++) {
        const currentId: number = items[index].id
        if (currentId === targetId) {
            return index
        }
    }
    return undefined;
}