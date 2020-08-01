import express, { Router, Request, Response } from "express";

import UserCollection from "../../../../models/User/user-collection.model";
import { UserToken } from "../../../../../client/src/types/user.types";

const router: Router = express.Router();

/**
 * Update user profile properties
 * @param req Expects a key (as JSON) on the UserCollection that will be updated
 * @param res Replies with the updated user object
 */
const updateProfile = (req: Request, res: Response) => {
    const { id } = res.locals.authorizedData as UserToken;
    const patch = req.body;

    UserCollection.findById(id, (err, user) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);

            return;
        }

        // TODO: Fix status and returned error
        if (!user) {
            console.error(err);
            res.statusCode = 500;
            res.json({
                error: "There was an issue when retrieving the user",
            });

            return;
        } else {
            const userObj = user.toObject();
            const patchedUser = { ...userObj, ...patch };

            user.updateOne(patchedUser, { upsert: false }, (err) => {
                if (err) {
                    console.error(err);
                    res.sendStatus(400);

                    return;
                }

                // We do not want to expose id or password to the client
                let patchedUserResponse = patchedUser;
                delete patchedUserResponse._id;
                delete patchedUserResponse.password;

                // This isn't ideal, but updateOne on mongoose.Doc does not supply the updated doc
                res.json(patchedUserResponse);
                return;
            });

            return;
        }
    });
};

router.patch("/user/profile", (req: Request, res: Response) => {
    updateProfile(req, res);
});

export default router;
