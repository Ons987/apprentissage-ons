String.prototype.toDate = function (format) {
    var normalized = this.replace(/[^a-zA-Z0-9]/g, '-');
    var normalizedFormat = format.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
    var formatItems = normalizedFormat.split('-');
    var dateItems = normalized.split('-');

    var monthIndex = formatItems.indexOf("mm");
    var dayIndex = formatItems.indexOf("dd");
    var yearIndex = formatItems.indexOf("yyyy");
    var hourIndex = formatItems.indexOf("hh");
    var minutesIndex = formatItems.indexOf("ii");
    var secondsIndex = formatItems.indexOf("ss");

    var today = new Date();

    var year = yearIndex > -1 ? dateItems[yearIndex] : today.getFullYear();
    var month = monthIndex > -1 ? dateItems[monthIndex] - 1 : today.getMonth() - 1;
    var day = dayIndex > -1 ? dateItems[dayIndex] : today.getDate();

    var hour = hourIndex > -1 ? dateItems[hourIndex] : today.getHours();
    var minute = minutesIndex > -1 ? dateItems[minutesIndex] : today.getMinutes();
    var second = secondsIndex > -1 ? dateItems[secondsIndex] : today.getSeconds();

    return new Date(year, month, day, hour, minute, second);
};

function checkNaf(code){
    return /^\d{4}[A-Za-z]{1}$/.test(code);
}

function checkImmatriculation(imm) {
    return /^(\d{14})$/.test(imm);
}

String.prototype.replaceBetween = function (start, end, what) {
    return this.substring(0, start) + what + this.substring(end);
};


function validateSocialSecurity(ssNumber)
{
    return /^([1-37-8])([0-9]{2})(0[0-9]|[2-35-9][0-9]|[14][0-2])(0[1-9]|[1-8][0-9]|9[0-57-9]|2[ab])(00[1-9]|0[1-9][0-9]|[1-8][0-9]{2}|9[0-8][0-9]|990)([0-9]{3})([0-8][0-9]|9[0-7])$/.test(ssNumber);
}

function checkEmail(email)
{
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

var rad = function (x) {
    return x * Math.PI / 180;
};

function checkMobilePhoneNumner(phoneNumber) {
    return /^(0|(00|\+)33(0)?)(6|7)\d{8}$/.test(phoneNumber);
}

function checkLandPhoneNumner(phoneNumber) {
    return /^(0|(00|\+)33(0)?)[1-58-9]\d{8}$/.test(phoneNumber);
}

function getDistance(p1, p2) {
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = rad(p2.Latitude - p1.Latitude);
    var dLong = rad(p2.Longitude - p1.Longitude);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(p1.Latitude)) * Math.cos(rad(p2.Latitude)) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d/1000; // returns the distance in meter
};


var temporaryWorkerHolidayTypes = [
    "Repos hebdomadaire",
    "Congé payé",
    "Congé non payé",
    "Jour férié",
    "Accident de travail",
    "Maternité",
    "Visite médicale",
    "Absence justifiée",
    "Absence non justifiée",
    "Formation",
    "Mise à pied"
]