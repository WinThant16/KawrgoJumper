import axios from "axios";
//const axios = require("axios");
const HOST = "http://localhost:8080"


// log text is a string
function submitLog(logText){
    axios.post(`${HOST}/api/submitLogEntry`, logText, {headers: { "Content-Type": "text/plain; charset=ascii"}}).then((res)=>{
      console.log("Log submitted with response " + res.data);
    })
    .catch(error =>{
      console.error(error);
    })
}

function uploadManifest(name, contents){
  axios.post(`${HOST}/api/uploadManifest`, {"fileName":name, "fileContents":contents}, {headers: { "Content-Type": "application/json; charset=ascii"}}).then((res)=>{
    console.log("Uploaded manifest with response " + res.data);
  })
  .catch(error =>{
    console.error(error);
  })
}

// promise, must use .then((manifest)=>{}) or await
async function getCurrentManifest(){
  const res = await axios.get(`${HOST}/api/getCurrentManifest`);
  return res.data;
}

// promise, must use .then((manifest)=>{}) or await
async function computeUnload(array_of_container_coords){
  const res = await axios.post(`${HOST}/api/computeUnload`, {"containers": array_of_container_coords}, {headers: { "Content-Type": "application/json; charset=utf-8"}})
  return res.data;
}

// promise, must use .then((manifest)=>{}) or await
async function computeLoad(amount_of_containers_to_load){
  const res = await axios.post(`${HOST}/api/computeLoad`, {"amount": amount_of_containers_to_load}, {headers: { "Content-Type": "application/json; charset=utf-8"}})
  return res.data;
}

const reqLib = {submitLog, uploadManifest, getCurrentManifest}

export {submitLog, uploadManifest, getCurrentManifest};
export default reqLib;

//computeUnload([[0,1]]).then((steps)=>{console.log(steps)});
//computeLoad(3).then((steps)=>{console.log(steps)});