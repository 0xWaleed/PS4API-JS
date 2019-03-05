

let {PS4API, PS4Command} =  require('./js/PS4API');



 const ps4 = new PS4API('192.168.100.5');

 ps4.getProcessByName('default.elf', onEventResponse);



function onEventResponse(r) {
    console.log(r);
}