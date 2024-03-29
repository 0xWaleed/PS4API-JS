const {PS4API, PS4Command} = require('../js/PS4API');


const ps4 = new PS4API("192.168.100.5");


ps4.getProcessByName('default_mp.elf', onFoundProcess);


let base = 0;
let pid = 0;

function offset(offset) {
    return base + offset;
}

function onFoundProcess(result) {
    pid = result.data.pid;
    ps4.getProcessMap(pid, onFoundBase)
}

function onFoundBase(results) {
    const maps = results.data;
    for (let i = 0; i < maps.length; i++) {
        const map = maps[i];
        if (map.name === 'executable' && map.prot === 5) {
            base = map.start;
            getClientNames(map.start);
            ps4.writeMemory(pid, 0x1124B3 + base, Buffer.from('9090909090', 'hex'), 5, onPlayerName);
            break;
        }
    }
}


function getClientNames() {
    for (let i = 0; i < 6; i++){
        ps4.readMemory(pid, offset(0x1B0F29C + (0x3a80 * i)), 16, onPlayerName)
    }
}

function onPlayerName(results) {
    let nameBuffer = results.data;

    if (results.success)
    console.log(nameBuffer.toString('utf8'))
}