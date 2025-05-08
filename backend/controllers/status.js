//@ts-check
import expressAsyncHandler from "express-async-handler";

const getStatus = expressAsyncHandler(async (req, res) => {
    const result = {
        status: "OK",
    };

    res.status(200).json(result);
});

export {
    getStatus
};