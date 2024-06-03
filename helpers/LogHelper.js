import chalk from "chalk";
import BaseHelper from "../base/BaseHelper.js";

export default class LogHelper extends BaseHelper {
    constructor() {
        super();
    }

    static info = (message) => {
        console.log(chalk.blue(message));
    }
}
