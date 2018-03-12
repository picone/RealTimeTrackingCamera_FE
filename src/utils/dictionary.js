/**
 * Created by ChienHo on 2018/3/12.
 */

export default class Dictionary {

    constructor() {
        this.dict = window.DICT || {};
    }

    get(key) {
        if (key) {
            return this.dict[key];
        } else {
            return this.dict;
        }
    }

    set(key, val) {
        this.dict[key] = val;
        window.DICT = this.dict;
    }
}

