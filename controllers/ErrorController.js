import BaseController from "../base/BaseController.js";

class ErrorController extends BaseController {
    constructor(res) {
        super(res);
    }

    getNotFound = async (req, res, next) => {
        return this.notFound();
    }
    getSystemError = async (error, req, res, next) => {
        return this.error({ error });
    }
}

export default ErrorController;