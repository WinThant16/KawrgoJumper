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

const reqLib = {submitLog}

export {submitLog};
export default reqLib;
