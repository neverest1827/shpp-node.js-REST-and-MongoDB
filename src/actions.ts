import {TypeActions} from "./types.js";
import * as routeTasks from "./routeTasks.js";

export const actions: TypeActions = {
    getItems: routeTasks.getItems,
    deleteItem: routeTasks.deleteItem,
    createItem: routeTasks.addItem,
    editItem: routeTasks.updateItem,
    logout: routeTasks.logout,
    login: routeTasks.login,
    register: routeTasks.register
}