import React from "react";

import ToDoItem from "./ToDoItem";
import ToDoCreate from "./ToDoCreate";

import { Item } from "../../types/to-do-types";

type Props = {
    items?: Item[];
    handleCreateOnClick: () => void;
    handleDeleteOnClick: (index: number) => void;
};

const ToDoForm: React.FunctionComponent<Props> = (props: Props) => {
    const { items, handleCreateOnClick, handleDeleteOnClick } = props;

    let toDoItems: JSX.Element | JSX.Element[];
    if (items && items.length > 0) {
        // console.log("test");
        toDoItems = items.map((item, index) => {
            return (
                <ToDoItem
                    key={index}
                    index={index}
                    text={item.text}
                    handleDeleteOnClick={handleDeleteOnClick}
                />
            );
        });
    } else {
        toDoItems = <div>There are no items</div>;
    }

    return (
        <div>
            <p>There should probably be a header here or something</p>
            <ToDoCreate handleCreateOnClick={handleCreateOnClick} />
            {toDoItems}
        </div>
    );
};

export default ToDoForm;
