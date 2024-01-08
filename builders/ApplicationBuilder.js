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
        this.api.use(this._errorControllerInit);
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
        this.api.use(`/${process.env.BASE_ROUTE}`, this.router[this.getRouteMethod(mapper.function)](`/${mapper.prefix}/${mapper.path}`, async (req, res, next) => {
            try {
                return await new (eval(controller.constructor.name))(res)[mapper.function](req, res, next);
            } catch (error) {
                next(error);
            }
        }));
    }

    getRouteMethod = (name) => {
        if (name.substring(0, 3) === 'get') return 'get';
        if (name.substring(0, 3) === 'put') return 'put';
        if (name.substring(0, 4) === 'post') return 'post';
        if (name.substring(0, 5) === 'patch') return 'patch';
        return 'delete';
    }

    _notFoundControllerInit = async (req, res, next) => {
        const controller = new ErrorController(res);
        return controller.getNotFound(req, next);
    }

    _errorControllerInit = async (error, req, res, next) => {
        const controller = new ErrorController(res);
        return controller.getSystemError(error);
    }
}
