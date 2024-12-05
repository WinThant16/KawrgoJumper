const {appendFile, promises, existsSync, mkdirSync, openSync} = require('fs');
const {platform, homedir} = require('os');
const {join, dirname} = require('path');
const { runInThisContext } = require('vm');

class logFileHandler{
    constructor(){
        this.location = this.getLogFileLocation();
        this.openLogFile(this.location);
        this.writeQueue = [];
    }

    // ex: /home/ks/KawrgoJumperLogs/2024-KawrgoJumper-LogFile.txt
    // ex: C:\Users\KS\KawrgoJumperLogs\2024-KawrgoJumper-LogFile.txt
    getLogFileLocation(){
        let path = homedir();
        const Year = new Date().getFullYear()
        return join(path,"KawrgoJumperLogs", "KeoghsPort"+Year+".txt")
    }

    openLogFile(location){
        // if KawrgoJumperLogs/ directory doesnt exist, make it
        if(!existsSync(dirname(location))){
            mkdirSync(dirname(location));
        }
        //Open the file for reading and appending. A file is created if it doesn’t exist.
        const logFileHandle = openSync(location, 'a+')
        this.fd = logFileHandle;
        console.log(this.fd)
    }

    pad0(number){
        if(number < 10){
            return `0${number}`;
        }else{
            return `${number}`;
        }
    }

    // enqueue a log entry to be written to the log file
    writeEntry(Text){
        const DateObj = new Date()
        let month = DateObj.getMonth();
        let day = DateObj.getDate();
        let hour = DateObj.getHours();
        let min = DateObj.getMinutes();
    
        const TimePrefix = `${DateObj.getFullYear()}-${this.pad0(month)}-${this.pad0(day)} ${this.pad0(hour)}:${this.pad0(min)}`
        console.log(TimePrefix)
        const entry = `${TimePrefix}        ${Text}\n`
        this.writeQueue.unshift(entry); // add to start of array
        this._writeEntry();
    }
    
    // The async version of appendFile (the one used) is nonblocking, meaning the server can
    // continue receiving requests while the file is writing. If we used appendFileSync there is
    // a (very..very) small blocking window.
    _writeEntry(){
        // if theres items in queue, we need to write them.
        while(this.writeQueue.length > 0){
            if (!this.fd){
                console.warn("Log messages queued, but log fd isnt ready. Data loss possible.")
            }
            while (!this.fd){
                // file handle isnt ready?!
                // must wait.
            }
            // take from end of array (we add to start, take from end)
            appendFile(this.fd, this.writeQueue.pop(), {encoding: 'ascii'}, ()=>{});
            console.log("Wrote to log.");
        }
    }
}

// const log = new logFileHandler();
// log.writeEntry("hello world")
// log.writeEntry("hello world1")
// log.writeEntry("hello world2")
// log.writeEntry("hello world3")
// log.writeEntry("hello world4")
// log.writeEntry("555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555")
// log.writeEntry("66666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666")
module.exports = {logFileHandler}