const express = require('express')
const app = express();
const server = app.listen(8080);

const lfh = require("../lib/logfile.js");
const log_file_handler = new lfh.logFileHandler()

const {computeUnload, computeLoad} = require("../lib/loadUnload.js");
const { parse_manifest } = require('../lib/manifest_parser.js');

app.use(express.text());
app.use(express.json());

app.use(express.static('./build'));

class manifest{
    name;
    contents;
    parsed;
}
const currentManifest = new manifest();

/*
 Log file endpoint 
 Type: POST
 Body: Log entry text
 Note: Timestamp is handled by server
*/
app.post('/api/submitLogEntry', function(req, res){
    console.log("Received SubmitLogEntry");
    console.log(req.body);
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
    currentManifest.name = req.body.fileName;
    currentManifest.contents = req.body.fileContents;
    res.send("OK");
    currentManifest.parsed = parse_manifest(currentManifest.contents);
    console.log(currentManifest)
});


/*
 Get Current Manifest (for debug) 
 Type: GET
 Body: None
*/
app.get('/api/getCurrentManifest', function(req, res){
    console.log("Received getCurrentManifest");
    res.send({
        "name":currentManifest.name,
        "contents": currentManifest.contents
    });
});

/*
 Compute Unload Steps on current manifest
 Type: POST
 Body: JSON payload of containers to unload: {containers: [[1,2],[3,4],[5,6]]}
*/
app.post('/api/computeUnload', function(req, res){
    console.log("Received computeUnload");
    const containers = req.body.containers;
    const steps = computeUnload(currentManifest.parsed, containers);
    res.send(steps);
});

/*
 Compute Unload Steps on current manifest
 Type: POST
 Body: JSON payload: amount of containers {amount: 3}
*/
app.post('/api/computeLoad', function(req, res){
    console.log("Received computeLoad");
    const amount = req.body.amount;
    const steps = computeLoad(currentManifest.parsed, amount);
    res.send(steps);
});

app.get('*', (req, res) => {                       
    res.sendFile(require("path").resolve('./build', 'index.html'));                               
  });