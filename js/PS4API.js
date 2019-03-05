"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Helper_1 = require("./Helper");
const HTTP_STATUS_OK = 200;
var PS4Command;
(function (PS4Command) {
    PS4Command["NOTIFY"] = "notify";
    PS4Command["FREE_MEMORY"] = "free";
    PS4Command["ALLOCATE_MEMORY"] = "alloc";
    PS4Command["RESUME_PROCESS"] = "resume";
    PS4Command["PAUSE_PROCESS"] = "pause";
    PS4Command["WRITE_MEMORY"] = "write";
    PS4Command["READ_MEMORY"] = "read";
    PS4Command["GET_PROCESS_LIST"] = "list";
    PS4Command["GET_PROCESS_INFO"] = "info";
    PS4Command["GET_PROCESS_MAP"] = "mapping";
    PS4Command["GET_PROCESS_BY_NAME"] = "process_by_name";
})(PS4Command = exports.PS4Command || (exports.PS4Command = {}));
class PS4API {
    constructor(ip) {
        this.ip = ip;
        this.ps4Endpoint = `http://${this.ip}:771`;
    }
    callPS4(cmd, arg, callBack, type = 'json') {
        let args = arg ? `?${arg}` : '';
        console.log(`${this.ps4Endpoint}/${cmd}${args}`);
        Helper_1.Helper.get(`${this.ps4Endpoint}/${cmd}${args}`, function (r) {
            let passingReturn = null;
            if (r.status !== HTTP_STATUS_OK)
                type = null;
            switch (type) {
                case 'json':
                    passingReturn = JSON.parse(r.responseText);
                    break;
                case 'base64':
                    passingReturn = Buffer.from(r.responseText, 'base64');
                    break;
                default:
                    passingReturn = null;
                    break;
            }
            Helper_1.Helper.callSafely(callBack, { command: cmd, data: passingReturn, success: r.status === HTTP_STATUS_OK });
        });
    }
    getProcessList(callBack) {
        this.callPS4(PS4Command.GET_PROCESS_LIST, null, callBack);
    }
    getProcessByName(name, callBack) {
        if (!Helper_1.Helper.checkIsCallBack(callBack))
            return;
        this.getProcessList(function (result) {
            const processes = result.data;
            for (let i = 0; i < processes.length; i++) {
                const proc = processes[i];
                if (proc.name === name) {
                    Helper_1.Helper.callSafely(callBack, { data: proc, command: PS4Command.GET_PROCESS_BY_NAME, success: result.success });
                    return;
                }
            }
            Helper_1.Helper.callSafely(callBack, { data: null, command: PS4Command.GET_PROCESS_BY_NAME, success: result.success });
        });
    }
    getProcessInfo(pid, callBack) {
        this.callPS4(PS4Command.GET_PROCESS_INFO, `pid=${pid}`, callBack);
    }
    getProcessMap(pid, callBack) {
        this.callPS4(PS4Command.GET_PROCESS_MAP, `pid=${pid}`, callBack);
    }
    readMemory(pid, address, length, callBack) {
        let bigInteger = BigInt(address).toString(16);
        this.callPS4(PS4Command.READ_MEMORY, `pid=${pid}&address=${bigInteger}&length=${length}`, callBack, 'base64');
    }
    writeMemory(pid, address, data, length, callBack) {
        let dataAsBase64 = data.toString('base64');
        let bigInteger = BigInt(address).toString(16);
        this.callPS4(PS4Command.WRITE_MEMORY, `pid=${pid}&address=${bigInteger}&length=${length}&data=${dataAsBase64}`, callBack, null);
    }
    notify(messageType, message, callBack) {
        this.callPS4(PS4Command.NOTIFY, `messageType=${messageType}&message=${Buffer.from(message).toString('base64')}`, callBack, null);
    }
    pause(pid, callBack) {
        this.callPS4(PS4Command.PAUSE_PROCESS, `pid=${pid}`, callBack, null);
    }
    resume(pid, callBack) {
        this.callPS4(PS4Command.RESUME_PROCESS, `pid=${pid}`, callBack, null);
    }
    allocateMemory(pid, length, callBack) {
        this.callPS4(PS4Command.ALLOCATE_MEMORY, `pid=${pid}&length=${length}`, callBack, 'base64');
    }
    freeMemory(pid, address, length, callBack) {
        let bigInteger = BigInt(address).toString(16);
        this.callPS4(PS4Command.FREE_MEMORY, `pid=${pid}&address=${bigInteger}&length=${length}`, callBack, null);
    }
}
exports.PS4API = PS4API;
