import BaseController from "../base/BaseController.js"

export default class WatherforecastController extends BaseController {

    constructor(res) {
        super(res);
        this.initMetadata(this.methodMapper, 'weather');
    }

    methodMapper = [
        { function: 'getWeatherByCity', path: 'city/:cityId' },
        { function: 'getSmthng', path: 'smthng' }
    ]

    getWeatherByCity = async (req) => {
        throw new Error('Handles 500!!');
        return this.ok({ content: { cityId: req.params[cityId], weather: '25F' } });
    }

    getSmthng = async (req) => {
        this.throws('Your request seems wrong');
        this.throws(new Error('servers seems wrong 500'));
        return this.ok({ content: { cityId: req.params[cityId], weather: '25F' } });
    }
}