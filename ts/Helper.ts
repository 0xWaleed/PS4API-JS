import {XMLHttpRequest} from "xmlhttprequest-ts";


export class Helper {
    static http(method:string, url:string, callBack:Function) {
        let xHttp = new XMLHttpRequest();

        xHttp.onreadystatechange = function () {
            if (xHttp.readyState === XMLHttpRequest.DONE) {
                callBack(xHttp);
            }
        };

        xHttp.open(method, url);
        xHttp.send();
    }

    static  get(url:string, callBack:Function) {
        Helper.http('GET', url, callBack);
    }
    static  checkIsCallBack(callBack:Function) {
        return typeof (callBack) === typeof (Function);
    }

    static callSafely(callBack, ...args){
        if (Helper.checkIsCallBack(callBack))
            callBack(...args);
    }
}