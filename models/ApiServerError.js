import HttpStatusCodes from "../enums/HttpStatusCodes.js";
import ApiError from "./ApiError.js";

export default class ApiServerError extends ApiError {
    constructor({ exception, message = "An error occured at server", statusCode = HttpStatusCodes.SERVER_ERROR }) {
        super(message, statusCode);

        if (process.env.ENV === 'DEV') this.controller = this.getGroup(exception.stack);
    }
}