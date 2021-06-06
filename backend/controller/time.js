var moment = require('moment-timezone');

exports.Indiatime = () => {
	var time = moment.tz(new Date(), "Asia/Kolkata");
	time.utc("+530").format();
	return time;	
}