import {TodoItem} from "../models/TodoItem";
import {parseUserId} from "../auth/utils";
import {CreateTodoRequest} from "../requests/CreateTodoRequest";
import {UpdateTodoRequest} from "../requests/UpdateTodoRequest";

import {ToDoAccess} from "../dataLayer/ToDoAccess";
const uuidv4 = require('uuid/v4');
const toDoAccess = new ToDoAccess();
import {TodoUpdate} from "../models/TodoUpdate";


export async function getAllToDo(jwtToken: string): Promise<TodoItem[]> {
    const userId = parseUserId(jwtToken);
    return toDoAccess.getAllToDo(userId);
}

export function createToDo(createTodoRequest: CreateTodoRequest, jwtToken: string): Promise<TodoItem | string> {
    const userId = parseUserId(jwtToken);
    const todoId =  uuidv4();
    // const s3BucketName = process.env.S3_BUCKET_NAME;
    // const s3BucketName = "serverless-todo-app-abzed-dev";
    
    const validToDo = createTodoRequest.name.length > 2 && createTodoRequest.name.split(' ').length === 1 

    console.log("Data", createTodoRequest)

    return validToDo ?  toDoAccess.createToDo({
        userId: userId,
        todoId: todoId,
        attachmentUrl:  `https://serverless-todo-app-abzed-dev.s3.amazonaws.com/${todoId}`, 
        createdAt: new Date().getTime().toString(),
        done: false,
        ...createTodoRequest,
    }) : new Promise<string>((_) => "Invalid request");
}

export function updateToDo(updateTodoRequest: UpdateTodoRequest, todoId: string, jwtToken: string): Promise<TodoUpdate> {
    const userId = parseUserId(jwtToken);
    return toDoAccess.updateToDo(updateTodoRequest, todoId, userId);
}

export function deleteToDo(todoId: string, jwtToken: string): Promise<string> {
    const userId = parseUserId(jwtToken);
    return toDoAccess.deleteToDo(todoId, userId);
}

export function generateUploadUrl(todoId: string): Promise<string> {
    return toDoAccess.generateUploadUrl(todoId);
}