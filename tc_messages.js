'use strict';

var chalk = require('chalk');
var convert = require('convert-seconds');
var pendel = require('pendel');
var zp = require('simple-zeropad');
var to24 = require('twelve-to-twentyfour');


/**
 * Error messages.
 *
 */
module.exports.errors = {

    'clockOutIsPending':    "\n" + chalk.bgRed("TIMECARD ERROR:") + chalk.bold.white(" You must clockout before clocking in. \n")+ chalk.bold.white("Tip:") +" Clock out with the "+chalk.cyan("clockout")+" command, or edit the timecard file manually. \n",
    'noClockInFound':       "\n" + chalk.bgRed("TIMECARD ERROR:") + chalk.bold.white(" You must clockin before clocking out. \n")+ chalk.bold.white("Tip:") +" Clock in with the "+chalk.cyan("clockin")+" command, or edit the timecard file manually. \n",
    'noGitIgnoreFound':		"\n" + chalk.bgRed("GITIGNORE ERROR:") + chalk.bold.white(" No .gitignore file found in current working directory. \n")
};


/**
 * General messages.
 *
 */
module.exports.messages = {

    'createdNewTimeCard':   	"\n  "+chalk.bgCyan.black("TIMECARD:") + chalk.bold.white(" You have created a new timecard file. \n")+ chalk.bold.white("  Tip:") +" Clock in with the "+chalk.cyan("clockin")+" command, Clock out with the "+chalk.cyan("clockout")+" command \n",
    'successfulClockin':    	"\n  "+chalk.bgCyan.black("TIMECARD:") + chalk.bold.white(" You have ") + chalk.bold.green("clocked in: ") + time() + "\n",
    'successfulClockout':   	"\n  "+chalk.bgCyan.black("TIMECARD:") + chalk.bold.white(" You have ") + chalk.bold.red("clocked out: ") + time() + "\n",
    'prettyPrintHeader':    	"\n  "+chalk.bgCyan.black("TIMECARD:") + chalk.cyan(" Logged hours") + "\n\n  "+chalk.gray("______________________________________________\n"),
    'prettyPrintBorder':    	chalk.gray("\n  ______________________________________________"),
    'alreadExistsInGitIgnore':	"\n  "+chalk.bgCyan.black("GITIGNORE:") + chalk.bold.white(" The .gitignore file already contains .timecard.json. Nothing was appended! \n"),
    'successfulAppended':		"\n  "+chalk.bgCyan.black("GITIGNORE:") + chalk.bold.white(" .timecard.json was appended to file! \n")
};


/**
 * Output data to the console.
 *
 * @param {string} str
 */
module.exports.print = function(str){
    console.log("\n  "+chalk.gray(str));
};


/**
 * A Helper function to generate the total time data.
 *
 * @note: This prints the total hours/mins/secs on the
 * bottom when the user types `timecard print`.
 *
 * @param {number} seconds - the number of seconds recorded in the timecard project.
 */
module.exports.summary = function(seconds){

    var total = convert(seconds);
    console.log( "\n  "+chalk.bgCyan.black("TIMECARD:") + chalk.cyan(" TOTAL TIME") + "\n" );
    console.log( "  "+chalk.white("Hours: ")   + total.hours );
    console.log( "  "+chalk.white("Minutes: ") + total.minutes );
    console.log( "  "+chalk.white("Seconds: ") + total.seconds );
    console.log();

};


/**
 * Pretty-print the timecard data.
 *
 * @param {object} timeobj - the timecard data object
 */
module.exports.prettyPrintEntry = function(timeobj){

    var time = makeTimeString(pendel(timeobj.startTime, timeobj.endTime));

    var tasks;

    if (timeobj.hasOwnProperty("tasks") && timeobj.tasks.length > 0){

        tasks = "";

        for (var i = 0; i < timeobj.tasks.length; i++){
            tasks += "   - "+timeobj.tasks[i]+"\n";
        }
    }

    console.log( "  "+chalk.white(timeobj.date) + chalk.cyan(" "+to24(timeobj.startTime) +" - " + to24(timeobj.endTime)) + chalk.gray(" [")+time+chalk.gray("]") );

    if (tasks) {
        console.log("\n"+chalk.gray(tasks)+"\n");
    }

};


/**
 * Get the current time in the format: "Wed Apr 09 2015"
 *
 * @returns {string}
 */
function time(){
    var date = new Date().toString();
    return date.slice(16, 24)
}


/**
 * Make a timestring in the format of "00:00:00"
 *
 * @param {object} timeObj - the duration object returned by pendel.
 * @returns {string}
 */
function makeTimeString(timeObj){
    return zp(timeObj.hours)+":"+zp(timeObj.minutes)+":"+zp(timeObj.seconds);

}
