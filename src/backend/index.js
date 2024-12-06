const express = require('express')
const app = express();
const server = app.listen(8080);

const lfh = require("../lib/logfile.js");
const log_file_handler = new lfh.logFileHandler()

app.use(express.text());
app.use(express.json());

app.use(express.static('./build'));

class manifest{
    name;
    contents;
}
const currentManifest = new manifest;
/*
 Log file endpoint 
 Type: POST
 Body: Log entry text
 Note: Timestamp is handled by server
*/
app.post('/api/submitLogEntry', function(req, res){
    console.log("Received SubmitLogEntry");
    console.log(req.body)
    log_file_handler.writeEntry(req.body);
    res.send("OK");
});

/*
 Upload manifest 
 Type: POST
 Body: JSON payload: {fileName:"keogh.txt". fileContents:""}
*/
app.post('/api/uploadManifest', function(req, res){
    console.log("Received uploadManifest");
    console.log(req.body);
    currentManifest.name = req.body.fileName;
    currentManifest.contents = req.body.fileContents;
    console.log(currentManifest)
    res.send("OK");
});


/*
 Get Current Manifest (for debug) 
 Type: GET
 Body: None
*/
app.get('/api/getCurrentManifest', function(req, res){
    console.log("Received getCurrentManifest");
    res.send(currentManifest);
});

/*
 Compute Unload Steps on current manifest
 Type: POST
 Body: JSON payload: 
*/
app.post('/api/computeUnload', function(req, res){
    console.log("Received computeUnload");

    res.send("Not Implemented");
});

/*
 Compute Unload Steps on current manifest
 Type: POST
 Body: JSON payload: 
*/
app.post('/api/computeLoad', function(req, res){
    console.log("Received computeLoad");

    res.send("Not Implemented");
});