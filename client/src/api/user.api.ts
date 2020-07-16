import { UserPartial, User } from "../types/user.types";
import {
    ApiError,
    ApiResponse,
    UserPasswordUpdatePayload,
    UserCreationPayload,
    UserLoginPayload,
} from "../types/api.types";
import { handleResponseErrors } from "../utils/api.utils";

export const loginUser = async (login: UserLoginPayload) => {
    const payload = login;

    const request = await fetch(`/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json;charset=utf-8" },
        body: JSON.stringify(payload),
    });

    if (!request.ok) {
        return handleResponseErrors(request);
    }

    const response: ApiResponse<User> = {
        result: "success",
        response: await request.json(),
    };

    return response;
};

export const patchUser = async (update: UserPartial, token: string) => {
    const payload = update;

    const request = await fetch(`/api/user/profile`, {
        method: "PATCH",
        headers: {
            Authorization: token,
            "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(payload),
    });

    if (!request.ok) {
        return handleResponseErrors(request);
    }

    const response: ApiResponse<User> = {
        result: "success",
        response: await request.json(),
    };

    return response;
};

//TODO:
// delete (UserProfile)
// update PW (UserProfile)
// create new user (Register)

export const deleteUser = async (token: string) => {
    const request = await fetch(`/api/user/deleteUser`, {
        method: "DELETE",
        headers: {
            Authorization: token,
        },
    });

    return request;
};

export const updateUserPassword = async (
    update: UserPasswordUpdatePayload,
    token: string
) => {
    const payload = update;

    const request = await fetch(`/api/user/password/updatePassword`, {
        method: "PUT",
        headers: {
            Authorization: token,
            "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(payload),
    });

    if (!request.ok) {
        return handleResponseErrors(request);
    }

    // API response is a 204, so nothing is actually returned if successful
    return;
};

export const createUser = async (newUser: UserCreationPayload) => {
    const payload = newUser;

    const request = await fetch("/api/users/addUser", {
        method: "POST",
        headers: { "Content-Type": "application/json;charset=utf-8" },
        body: JSON.stringify(payload),
    });

    if (!request.ok) {
        const errors: ApiResponse<ApiError> = await request.json();

        return errors;
    }

    const response = await request.json();
    const apiResponse: ApiResponse<User> = {
        result: "success",
        response: response,
    };

    return apiResponse;
};
