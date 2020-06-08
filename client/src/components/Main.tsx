import React, { Component } from "react";
import JwtDecode from "jwt-decode";

import ToDoForm from "./ToDos/ToDoForm";
import ApiCallButton from "./ApiCallButton";

import { Item } from "../types/to-do.types";
import { ApplicationState } from "../types/application-state.types";
import { UpdateStateActions } from "../types/state-action.types";

import styles from "./Main.module.scss";

type Props = {
    applicationState: ApplicationState;
    handleAppStateUpdate: (
        newState: ApplicationState,
        actionToTake: UpdateStateActions
    ) => void;
};
type State = {
    items?: Item[];
};

// TODO: Probably just make this a functional component now
class Main extends Component<Props, State> {
    state: State = {
        items: [
            { isComplete: true, text: "Item 1" },
            { isComplete: false, text: "Item 2" },
            { isComplete: false, text: "Item 3" },
        ],
    };

    async componentDidMount() {
        await this.handleGetAllUserTodos();

        return;
    }

    handleGetAllUserTodos = async (): Promise<void> => {
        const { isAuthenticated, user } = this.props.applicationState;
        if (isAuthenticated && user !== null) {
            const token = user.token as string;

            const fetchUserTodos = await fetch(`/api/user/todos`, {
                method: "GET",
                headers: {
                    Authorization: token,
                },
            });
            const userTodos: Item[] = await fetchUserTodos.json();

            if (userTodos.length) {
                const todoToItems: Item[] = userTodos.map((todo) => {
                    const item: Item = {
                        _id: todo._id,
                        userid: todo.userid,
                        isComplete: todo.isComplete,
                        text: todo.text,
                    };

                    return item;
                });

                const newItems = [
                    ...this.props.applicationState.items,
                    ...todoToItems,
                ];

                let newState = this.props.applicationState;
                newState.items = newItems;

                this.props.handleAppStateUpdate(newState, "updateItemsState");
            }
        }

        return;
    };

    // TODO: Fix this function so it calls handleItemCreation
    handleCreateOnClick = async (inText: string): Promise<void> => {
        const {
            isAuthenticated,
            user,
            items: appStateItems,
        } = this.props.applicationState;

        // this is used futher down so we don't need to repeat the state update depending on whether user is authed
        let newState = this.props.applicationState;

        // this is an array as the API expects an array input
        const newItem: Item[] = [{ isComplete: false, text: inText }];

        if (isAuthenticated && user !== null) {
            const token = user.token as string;

            const response = await fetch(`/api/user/todos`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    Authorization: token,
                    "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify(newItem),
            });

            // the API returns an array of Item objects
            const createdItem: Item[] = await response.json();
            const newItems = [...appStateItems, ...createdItem];
            newState.items = newItems;
        } else {
            const newItems = [...appStateItems, ...newItem];
            newState.items = newItems;
        }

        this.props.handleAppStateUpdate(newState, "updateItemsState");
    };

    /**
     * Generic item update handler for both local state and database updates
     * @param {Item} item The updated Item object to be saved
     * @param {number} index The index of the item - required as local state items do not have an ID
     */
    handleItemUpdate = async (item: Item, index: number): Promise<void> => {
        const { handleAppStateUpdate, applicationState } = this.props;
        const { isAuthenticated, user } = applicationState;
        console.log("handleItemUpdate - clicky");

        try {
            if (isAuthenticated && user && item._id) {
                const token = user.token as string;

                const updateRequest = await fetch(
                    `/api/user/todos/${item._id}`,
                    {
                        method: "PUT",
                        headers: {
                            Authorization: token,
                            "Content-Type": "application/json;charset=utf-8",
                        },
                        body: JSON.stringify(item),
                    }
                );

                await updateRequest;
            }

            let newState = applicationState;
            newState.items[index] = item;

            handleAppStateUpdate(newState, "updateItemsState");
        } catch (err) {
            console.error(err);
        }
    };

    handleDeleteOnClick = async (index: number): Promise<void> => {
        const { handleAppStateUpdate, applicationState } = this.props;
        const {
            isAuthenticated,
            user,
            items: appStateItems,
        } = applicationState;

        const currentItem = appStateItems[index];

        let newState = applicationState;

        try {
            if (isAuthenticated && user !== null && currentItem._id) {
                const token = user.token as string;

                const deleteRequest = await fetch(
                    `/api/users/todos/${currentItem._id}`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization: token,
                            "Content-Type": "application/json;charset=utf-8",
                        },
                        body: JSON.stringify(currentItem),
                    }
                );

                await deleteRequest;
            }

            // in case there is no DB call, we still update state here
            newState.items.splice(index, 1);
            handleAppStateUpdate(newState, "updateItemsState");
        } catch (err) {
            console.error(err);
        }

        return;
    };

    /**
     * Sends request to save an array items into the database
     * @param {Item[]} items An array of items
     */
    handleItemCreation = async (items: Item[]): Promise<Item[] | undefined> => {
        console.log("handle item create clicked");
        const { applicationState } = this.props;
        const { isAuthenticated, user } = applicationState;
        try {
            if (isAuthenticated && user !== null) {
                const token = user.token as string;

                const saveRequest = await fetch(`/api/user/todos`, {
                    method: "POST",
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json;charset=utf-8",
                    },
                    body: JSON.stringify(items),
                });

                // TODO: Update the now saved items with their IDs in local state
                const saveResponse = await saveRequest.json();
                console.log(saveResponse);
                return saveResponse;
            }
        } catch (err) {
            console.error(err);
        }
    };

    handleSaveUnsavedItems = async (): Promise<void> => {
        const { items } = this.props.applicationState;

        // we cannot both filter items AND keep the index of where that item was in state
        // we create a type which keeps the index which the item is in, then filter it down to only the items we need to save
        // we then use this later on to overwrite the specific state item based
        // we do this to avoid additional database calls (i.e. loading all items again)
        type ItemsWithStateIndex = {
            index: number;
            item: Item;
        };
        const itemsToSaveWithIndex: ItemsWithStateIndex[] = items
            .map((item, index) => {
                const itemToSave: ItemsWithStateIndex = {
                    index: index,
                    item: item,
                };

                return itemToSave;
            })
            .filter((item) => !("_id" in item.item));

        const itemsToSave: Item[] = itemsToSaveWithIndex.map(
            (item) => item.item
        );

        try {
            let stateItemsToSave = items;

            const createdItems = await this.handleItemCreation(itemsToSave);
            createdItems?.forEach((item, index) => {
                stateItemsToSave[index] = item;
            });

            this.setState((prevState: State) => ({
                ...prevState,
                items: stateItemsToSave,
            }));
        } catch (err) {
            console.error(err);
        }
    };

    render() {
        const { isAuthenticated, user, items } = this.props.applicationState;
        const unsavedItemsExist: boolean =
            isAuthenticated &&
            user !== null &&
            !items.every((item) => "_id" in item);

        return (
            <div className={styles.app}>
                <header className={styles.appHeader}>
                    {/* The user in the application state is:{" "}
                    {this.props.applicationState.user} */}
                    <ApiCallButton />
                    <ToDoForm
                        items={this.props.applicationState.items}
                        isAuthenticated={
                            this.props.applicationState.isAuthenticated
                        }
                        handleCreateOnClick={this.handleCreateOnClick}
                        handleDeleteOnClick={this.handleDeleteOnClick}
                        handleItemUpdate={this.handleItemUpdate}
                    />
                </header>
                {unsavedItemsExist && (
                    <p>
                        You have items that are not in the database{" "}
                        <button onClick={this.handleSaveUnsavedItems}>
                            Click to save
                        </button>
                    </p>
                )}
            </div>
        );
    }
}

export default Main;
