//@ts-check

const constants = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDED: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    UPGRADE_REQUIRED: 426,
    SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    SERVICE_UNAVAILABLE: 503,
};

/**
 * Function that catches un/intentional errors and formats the default responses.
 * @param {Error} err 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode ? res.statusCode : 500;
    if (statusCode == 200) {
        statusCode = 500;
        res.statusCode = 500;
    }

    const data = {
        message: err.message,
        result: false,
    };

    switch (statusCode) {
        case constants.BAD_REQUEST:
            data.title = "Bad Request";
            res.json(data);
            break;
        case constants.UNAUTHORIZED:
            data.title = "Unauthorized";
            res.json(data);
            break;
        case constants.FORBIDDED:
            data.title = "Forbidden";
            res.json(data);
            break;
        case constants.NOT_FOUND:
            data.title = "Not Found";
            res.json(data);
            break;
        case constants.METHOD_NOT_ALLOWED:
            data.title = "Method Not Allowed";
            res.json(data);
            break;
        case constants.CONFLICT:
            data.title = "Conflict";
            res.json(data);
            break;
        case constants.UPGRADE_REQUIRED:
            data.title = "Upgrade required";
            res.json(data);
            break;
        case constants.SERVER_ERROR:
            console.error(err.stack);
            data.title = "Internal error";
            res.json(data);
            break;
        case constants.NOT_IMPLEMENTED:
            data.title = "Not implemented";
            res.json(data);
            break;
        case constants.SERVICE_UNAVAILABLE:
            data.title = "Service Unavailable";
            res.json(data);
            break;
        default:
            console.log("No error, all good !");
            break;
    }
};

export default errorHandler;
