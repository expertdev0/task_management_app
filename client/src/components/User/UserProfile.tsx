import React from "react";

import { ApplicationState } from "../../types/application-state.types";
import { UpdateStateActions } from "../../types/state-action.types";
import { AvailableThemes } from "../../types/theme.types";

import styles from "./UserProfile.module.scss";

type Props = {
    applicationState: ApplicationState;
    handleAppStateUpdate: (
        newState: ApplicationState,
        actionToTake: UpdateStateActions
    ) => void;
};

const UserProfile = (props: Props) => {
    const handleOnClick = (theme: AvailableThemes) => {
        let newState = props.applicationState;
        newState.theme = theme;

        props.handleAppStateUpdate(newState, "updateThemeState");
    };

    return (
        <div className={styles.grid}>
            <h1>This is the user page</h1>
            <p>The current theme is: {props.applicationState.theme}</p>
            <button onClick={() => handleOnClick("dark")}>
                Set dark theme
            </button>
            <button onClick={() => handleOnClick("light")}>
                Set light theme
            </button>
        </div>
    );
};

export default UserProfile;