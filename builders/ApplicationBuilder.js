import express from 'express';
import cors from 'cors';
import BaseClass from '../base/BaseClass.js';
import ErrorController from '../controllers/ErrorController.js';

export default new class AplicationBuilder extends BaseClass {
    constructor() {
        super();
        let app = express();

        app = this.configureOptions(app);
        app = this.configureErrorRoutes(app);
        this.api = app;

        //TODO: Log application is running here
        this.api.listen(process.env.PORT);
    }

    configureOptions = (app) => {
        app.use(cors());
        app.use(express.json());
        app.set('json spaces', 2);
        app.use((_, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.setHeader('Access-Control-Allow-Header', 'Content-Type, Authorization');
            next();
        });
        return app;
    }

    configureErrorRoutes = (app) => {
        app.use('/', this._notFoundControllerInit);
        app.use(this._errorControllerInit);
        return app;
    }

    _notFoundControllerInit = async (req, res, next) => {
        const controller = new ErrorController(res);
        return controller.getNotFound();
    }

    _errorControllerInit = async (error, req, res, next) => {
        const controller = new ErrorController(res);
        return controller.getSystemError(error);
    }
}

