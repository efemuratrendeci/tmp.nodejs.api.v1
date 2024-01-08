import BaseController from "../base/BaseController.js"

export default class WatherforecastController extends BaseController {

    constructor(res) {
        super(res);
        this.initMetadata(this.methodMapper, 'weather');
    }

    methodMapper = [
        { function: 'getWeatherByCity', path: 'city/:cityId' }
    ]

    getWeatherByCity = async (req) => {
        throw new Error('Handles 500!!');
        return this.ok({ content: { cityId: req.params[cityId], weather: '25F' } });
    }
}