import axios from "axios";
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

// promise, must use .then((manifest)=>{})
async function getCurrentManifest(){
  const res = await axios.get(`${HOST}/api/getCurrentManifest`);
  return res.data;
}

const reqLib = {submitLog, uploadManifest, getCurrentManifest}

export {submitLog, uploadManifest, getCurrentManifest};
export default reqLib;
