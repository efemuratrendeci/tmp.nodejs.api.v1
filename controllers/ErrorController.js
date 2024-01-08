import BaseController from "../base/BaseController.js";
import ApiError from "../models/ApiError.js";
import ApiServerError from "../models/ApiServerError.js";

class ErrorController extends BaseController {
    constructor(res) {
        super(res);
    }

    getNotFound = async (req, next) => {
        try {
            return this.notFound({ message: `Requested url: ${req.url} not found` });
        } catch (error) {
            next(error)
        }

    }

    getCustomError = async (error, req, res, next) => {
        if (ApiError.isApiError(error)) {
            return this.response({ status: error.status, exception: error });
        } else {
            return next(error);
        }
    }

    getSystemError = async (error, req, res, next) => {
        return this.error({ exception: new ApiServerError({ exception: error }) });
    }
}

export default ErrorController;