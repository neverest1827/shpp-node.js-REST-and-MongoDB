import { TypeActions } from "./types.js";
import * as tasks from "./routeTasks.js";

/**
 * Object containing various actions for managing items and user authentication.
 * These actions are mapped to corresponding functions from the 'tasks' module.
 * - `getItems`: Retrieves items from the database or file.
 * - `deleteItem`: Deletes a specific item from the user's collection in the database or file.
 * - `createItem`: Creates a new item in the user's collection in the database or file.
 * - `editItem`: Updates the data of a specific item in the user's collection.
 * - `logout`: Logs out the user from the application.
 * - `login`: Handles user login functionality.
 * - `register`: Handles user registration functionality.
 */
export const actions: TypeActions = {
    getItems: tasks.getItems,
    deleteItem: tasks.deleteItem,
    createItem: tasks.createItem,
    editItem: tasks.editItem,
    logout: tasks.logout,
    login: tasks.login,
    register: tasks.register
}
