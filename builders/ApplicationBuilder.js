import express from 'express';
import cors from 'cors';
import BaseClass from '../base/BaseClass.js';
import ErrorController from '../controllers/ErrorController.js';
import WatherforecastController from '../controllers/WeatherforecastController.js';
import BaseController from '../base/BaseController.js';
import TrafficController from '../controllers/TrafficController.js';

export default new class AplicationBuilder extends BaseClass {
    constructor() {
        super();
        this.api = express();
        this.router = express.Router();

        this.configureOptions();
        this.configureRoutes();
        this.configureErrorRoutes();

        //TODO: Log application is running here
        this.api.use(`/${process.env.BASE_ROUTE}`, this.router);
        this.api.listen(process.env.PORT);
    }

    configureOptions = () => {
        this.api.use(cors());
        this.api.use(express.json());
        this.api.set('json spaces', 2);
        this.api.use((_, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.setHeader('Access-Control-Allow-Header', 'Content-Type, Authorization');
            next();
        });
    }

    configureErrorRoutes = () => {
        this.api.use('/', this._notFoundControllerInit);
        this.api.use(this._customErrorControllerInit, this._serverErrorControllerInit);
    }

    configureRoutes = () => {
        const controllers = [
            new WatherforecastController(),
            new TrafficController()
        ];

        for (const controller of controllers) {
            const mapper = JSON.parse(Reflect.getMetadata(`${controller.constructor.name}_route`, BaseController));
            this.addRoute(controller, mapper);
        }
    }

    addRoute = (controller, mapper) => {
        for (const map of mapper) {
            this.api.use(`/${process.env.BASE_ROUTE}`, this.router[this.extractRouteMethod(map.function)](`/${map.prefix}/${map.path}`, async (req, res, next) => {
                try {
                    return await new (eval(controller.constructor.name))(res)[map.function](req, res, next);
                } catch (error) {
                    next(error);
                }
            }));
        }
    }

    _notFoundControllerInit = async (req, res, next) => {
        const controller = new ErrorController(res);
        return controller.getNotFound(req, next);
    }

    _serverErrorControllerInit = async (error, req, res, next) => {
        const controller = new ErrorController(res);
        return controller.getSystemError(error);
    }

    _customErrorControllerInit = async (error, req, res, next) => {
        const controller = new ErrorController(res);
        return controller.getCustomError(error, req, res, next);
    }
}
