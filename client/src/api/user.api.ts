import { UserPartial, User } from "../types/user.types";
import {
    ApiError,
    ApiResponse,
    UserPasswordUpdatePayload,
    UserCreationPayload,
    UserLoginPayload,
} from "../types/api.types";
import { handleResponseErrors } from "../utils/api.utils";

export const addUser = async (newUser: UserCreationPayload) => {
    const payload = newUser;

    const request = await fetch(`/api/users/addUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json;charset=utf-8" },
        body: JSON.stringify(payload),
    });

    // if (!request.ok) {
    //     return handleResponseErrors(request);
    // }

    // const response: ApiResponse<User> = {
    //     result: "success",
    //     response: await request.json(),
    // };

    return request;
};

export const loginUser = async (login: UserLoginPayload) => {
    const payload = login;

    const request = await fetch(`/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json;charset=utf-8" },
        body: JSON.stringify(payload),
    });

    // if (!request.ok) {
    //     return handleResponseErrors(request);
    // }

    // const response: ApiResponse<User> = {
    //     result: "success",
    //     response: await request.json(),
    // };

    // return response;
    return request;
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

    // if (!request.ok) {
    //     return handleResponseErrors(request);
    // }

    // const response: ApiResponse<User> = {
    //     result: "success",
    //     response: await request.json(),
    // };

    // return response;
    return request;
};

export const deleteUser = async (token: string) => {
    const request = await fetch(`/api/user/deleteUser`, {
        method: "DELETE",
        headers: {
            Authorization: token,
        },
    });

    // if (!request.ok) {
    //     return handleResponseErrors(request);
    // }

    // const deletedUser: ApiResponse<User> = {
    //     result: "success",
    //     response: await request.json(),
    // };

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

    return request;
};
