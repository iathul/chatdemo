const moment = require('moment');

exports.msgFormat = (username,text)=>{
    return {
        username,
        text,
        time: moment().format('h:mm a')
    };
}