import HttpStatusCodes from "../enums/HttpStatusCodes.js";
import ApiError from "./ApiError.js";

export default class ApiClientError extends ApiError {
    constructor({ message, statusCode = HttpStatusCodes.BAD_REQUEST }) {
        super(message, statusCode);

        if (process.env.ENV === 'DEV') this.controller = this.getGroup(new Error().stack);
    }
}