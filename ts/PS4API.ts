import {Helper} from "./Helper"

const HTTP_STATUS_OK = 200;

export enum PS4Command{
    NOTIFY = 'notify',
    FREE_MEMORY = 'free',
    ALLOCATE_MEMORY = 'alloc',
    RESUME_PROCESS = 'resume',
    PAUSE_PROCESS = 'pause',
    WRITE_MEMORY = 'write',
    READ_MEMORY = 'read',
    GET_PROCESS_LIST = 'list',
    GET_PROCESS_INFO = 'info',
    GET_PROCESS_MAP = 'mapping',
    GET_PROCESS_BY_NAME = 'process_by_name'
}

export class PS4API {


    private ps4Endpoint: string = `http://${this.ip}:771`;
    public constructor(private ip: string) {}




    private callPS4(cmd:string, arg: string, callBack: Function, type:string = 'json') {
        let args = arg ? `?${arg}` : '';
        console.log(`${this.ps4Endpoint}/${cmd}${args}`)
        Helper.get(`${this.ps4Endpoint}/${cmd}${args}`, function (r:XMLHttpRequest) {

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

                Helper.callSafely(callBack, {command: cmd, data: passingReturn, success: r.status === HTTP_STATUS_OK});
        });
    }
    public getProcessList(callBack: Function) {
        this.callPS4(PS4Command.GET_PROCESS_LIST, null, callBack);
    }

    public getProcessByName(name: string, callBack: Function) {
        if (!Helper.checkIsCallBack(callBack))
            return;
        this.getProcessList(function (result) {
            const processes = result.data;
            for (let i = 0; i < processes.length; i++) {
                const proc = processes[i];
                if (proc.name === name) {
                    Helper.callSafely(callBack, {data: proc, command: PS4Command.GET_PROCESS_BY_NAME, success: result.success});
                    return;
                }
            }
            Helper.callSafely(callBack, {data: null, command: PS4Command.GET_PROCESS_BY_NAME, success: result.success});
        })
    }

    public getProcessInfo(pid: number, callBack: Function) {
        this.callPS4(PS4Command.GET_PROCESS_INFO, `pid=${pid}`, callBack);
    }

    public getProcessMap(pid: number, callBack: Function) {
        this.callPS4(PS4Command.GET_PROCESS_MAP, `pid=${pid}`, callBack);
    }

    public readMemory(pid: number, address: bigint, length: number, callBack: Function) {
        let bigInteger = BigInt(address).toString(16);
        this.callPS4(PS4Command.READ_MEMORY, `pid=${pid}&address=${bigInteger}&length=${length}`, callBack, 'base64');
    }

    public writeMemory(pid: number, address: bigint, data:Buffer, length: number, callBack: Function) {
        let dataAsBase64 = data.toString('base64');
        let bigInteger = BigInt(address).toString(16);
        this.callPS4(PS4Command.WRITE_MEMORY,`pid=${pid}&address=${bigInteger}&length=${length}&data=${dataAsBase64}`, callBack, null);
    }

    public notify(messageType:number, message:string, callBack:Function){
        this.callPS4(PS4Command.NOTIFY,`messageType=${messageType}&message=${Buffer.from(message).toString('base64')}`, callBack, null)
    }

    public pause(pid:number, callBack: Function){
        this.callPS4(PS4Command.PAUSE_PROCESS,`pid=${pid}`, callBack, null);
    }

    public resume(pid:number, callBack: Function){
        this.callPS4(PS4Command.RESUME_PROCESS,`pid=${pid}`, callBack, null);
    }

    public allocateMemory(pid:number, length:number, callBack:Function){
        this.callPS4(PS4Command.ALLOCATE_MEMORY,`pid=${pid}&length=${length}`, callBack,  'base64');
    }

    public freeMemory(pid:number, address:bigint, length:number, callBack: Function){
        let bigInteger = BigInt(address).toString(16);
        this.callPS4(PS4Command.FREE_MEMORY,`pid=${pid}&address=${bigInteger}&length=${length}`, callBack, null)
    }
}