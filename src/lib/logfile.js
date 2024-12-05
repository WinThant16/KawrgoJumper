const {readFile, writeFile, promises, existsSync} = require('fs');
const {mkdir, open} = promises;
const {platform, homedir} = require('os');
const {join, dirname} = require('path');

class logFileHandler{
    constructor(){
        this.location = this.getLogFileLocation();
        this.openLogFile(this.location);
    }

    // ex: /home/ks/KawrgoJumperLogs/2024-KawrgoJumper-LogFile.txt
    // ex: C:\Users\KS\KawrgoJumperLogs\2024-KawrgoJumper-LogFile.txt
    getLogFileLocation(){
        let path = homedir();
        const Year = new Date().getFullYear()
        return join(path,"KawrgoJumperLogs", "KeoghsPort"+Year+".txt")
    }

    async openLogFile(location){
        // if KawrgoJumperLogs/ directory doesnt exist, make it
        if(!existsSync(dirname(location))){
            await mkdir(dirname(location));
        }
        const logFileDescriptor = await open(location, 'a+'); //Open the file for reading and appending. A file is created if it doesn’t exist.
        this.fd = logFileDescriptor;
    }

    pad0(number){
        if(number < 10){
            return `0${number}`;
        }else{
            return `${number}`;
        }
    }

    writeEntry(Text){
        const DateObj = new Date()
        let month = DateObj.getMonth();
        let day = DateObj.getDate();
        let hour = DateObj.getHours();
        let min = DateObj.getMinutes();

        const TimePrefix = `${DateObj.getFullYear()}-${this.pad0(month)}-${this.pad0(day)} ${this.pad0(hour)}:${this.pad0(min)}`
        console.log(TimePrefix)
        const entry = `${TimePrefix}        ${Text}`
    }

}

//const log = new logFileHandler();
//log.writeEntry()

module.exports = {logFileHandler}