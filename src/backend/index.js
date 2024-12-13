const express = require('express')
const app = express();
const server = app.listen(8080);

const lfh = require("../lib/logfile.js");
const log_file_handler = new lfh.logFileHandler()

const {computeUnload, computeLoad} = require("../lib/loadUnload.js");
const { parse_manifest, matrix_to_string} = require('../lib/manifest_parser.js');
const path = require("path");
const fs = require("fs");
const os = require("os");
const { computeBalance } = require('../lib/balance.js');

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
    console.log(currentManifest.name)
});


/*
 Get Current Manifest (for debug) 
 Type: GET
 Body: None
*/
app.get('/api/getCurrentManifest', function(req, res){
    console.log("Received getCurrentManifest");
    currentManifest.contents = matrix_to_string(currentManifest.parsed)
    res.send({
        "fileName":currentManifest.name,
        "fileContents": currentManifest.contents
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

/*
 Compute Balance steps on current manifest
 Type: GET
 Body: None
*/
app.get('/api/computeBalance', function(req, res){
    console.log("Received computeBalance");
    const final_state = computeBalance(currentManifest.parsed);
    const steps = final_state.steps;
    currentManifest.parsed = final_state.manifest_matrix
    res.send(steps);
});

/*
 Save Manifest to Desktop
 Type: POST
 Body: JSON payload: {fileName:"keogh.txt". fileContents:""} or NOTHING (like nothing nothing)
 Response: saved file path
*/
app.post('/api/saveManifest', function(req, res){
    console.log("Received saveManifest");
    if(req.body && req.body.fileName && req.body.fileContents){
        console.log("Received updated manifest.")
        currentManifest.name = req.body.fileName;
        currentManifest.contents = req.body.fileContents;
        currentManifest.parsed = parse_manifest(currentManifest.contents);
        console.log(currentManifest)
    }else{
        console.log("Did not receive updated manifest, saving stored.")
    }
    let SavePath = path.join(os.homedir(), "Desktop", currentManifest.name.replace(/\.txt$/m,"OUTBOUND.txt"));
    let nonce = 0;

    // dont overwrite if file already exists
    if(fs.existsSync(SavePath)){
        while (fs.existsSync(SavePath.replace(/\.txt$/m,`_${nonce}.txt`))){ // while the file exists
            nonce += 1;
        }
        SavePath = SavePath.replace(/\.txt$/m,`_${nonce}.txt`)
    }

    console.log("Saving manifest to", SavePath);

    // update file contents with parsed manifest
    currentManifest.contents = matrix_to_string(currentManifest.parsed);

    // save file contents
    fs.writeFileSync(SavePath, currentManifest.contents);

    res.send(SavePath);
});

app.get('*', (req, res) => {                       
    res.sendFile(path.resolve('./build', 'index.html'));                               
  });