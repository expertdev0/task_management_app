import express, { Router, Request, Response } from "express";
import TodoCollection from "../../../../models/Todo/todo-collection.model";

const router: Router = express.Router();

router.get("/users/todos", (req: Request, res: Response) => {
    TodoCollection.find((err, todo) => {
        if (err) {
            console.error(err);
        }

        res.json(todo);
    });
});

export default router;