"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xmlhttprequest_ts_1 = require("xmlhttprequest-ts");
class Helper {
    static http(method, url, callBack) {
        let xHttp = new xmlhttprequest_ts_1.XMLHttpRequest();
        xHttp.onreadystatechange = function () {
            if (xHttp.readyState === xmlhttprequest_ts_1.XMLHttpRequest.DONE) {
                callBack(xHttp);
            }
        };
        xHttp.open(method, url);
        xHttp.send();
    }
    static get(url, callBack) {
        Helper.http('GET', url, callBack);
    }
    static checkIsCallBack(callBack) {
        return typeof (callBack) === typeof (Function);
    }
    static callSafely(callBack, ...args) {
        if (Helper.checkIsCallBack(callBack))
            callBack(...args);
    }
}
exports.Helper = Helper;
