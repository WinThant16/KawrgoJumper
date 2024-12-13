const {container} = require("./manifest_parser");

class node{
    row;
    col;
    prev;
    constructor(row,col,prev){
        this.row = row;
        this.col = col;
        this.prev = prev;
    }
}

class step{
    source;
    destination; // [row,col] or "TRUCK"
    path;
    constructor(source,destination,path){
        this.source = source;
        this.destination = destination;
        this.path = path;
    }
}

// create shallow copy so we can add top two rows without modifying original object
// also write those rows to forbidden_rows, if provided
function shallow_extended_matrix(manifest_matrix, forbidden_rows = []){
    const copy = [];
    for (let i = 0; i< manifest_matrix.length; i++){
        copy.push(manifest_matrix[i]);
    }
    forbidden_rows.push(copy.push([]) - 1); // push returns new length of array
    forbidden_rows.push(copy.push([]) - 1);
    for(let i = 0; i < manifest_matrix[0].length; i++){
        let col;
        if (i < 10){
            col = ` 0${i}`
        }else{
            col = `${i}`;
        }
        copy[manifest_matrix.length+1].push(new container("09", col, "00000", "UNUSED"));
        copy[manifest_matrix.length].push(new container("10", col, "00000", "UNUSED"));
    }
    return copy;
}

// return first empty row in a column
function getFirstEmptyRowInCol(manifest_matrix, Col){
    for(let i = 0; i < manifest_matrix.length; i++){ // from bottom to top
        if(manifest_matrix[i][Col].name === "UNUSED"){ // if slot is unused
            return i; // return row 
        }
    }
}

function validPosition(manifest_matrix,visited, row,col){
    // if within bounds
    if(manifest_matrix.length > row && row >= 0 && manifest_matrix[0].length > col && col >= 0){
        // if empty slot
        if(manifest_matrix[row][col].name === "UNUSED" && visited[row][col] !== 1){
            return true;
        }
    }
    return false;
}
// return path
function bfs(manifest_matrix, start, destination){
    const queue = [new node(start[0],start[1], false)];
    const visited = [...Array(10)].map(e => Array(12));
    while(queue.length > 0){
        const curNode = queue.shift();
        // end condition
        if(curNode.row === destination[0] && curNode.col === destination[1]){
            const path = []
            let prevNode = curNode;
            while(prevNode){
                path.unshift([prevNode.row, prevNode.col]);
                prevNode = prevNode.prev;
            }
            return path; // return path
        }
        if(validPosition(manifest_matrix, visited, curNode.row-1, curNode.col)){
            visited[curNode.row-1][curNode.col] = 1; // mark visited
            queue.push(new node(curNode.row-1, curNode.col, curNode))
        }
        if(validPosition(manifest_matrix, visited, curNode.row+1, curNode.col)){
            visited[curNode.row+1][curNode.col] = 1; // mark visited
            queue.push(new node(curNode.row+1, curNode.col, curNode))
        }
        if(validPosition(manifest_matrix, visited, curNode.row, curNode.col-1)){
            visited[curNode.row][curNode.col-1] = 1; // mark visited
            queue.push(new node(curNode.row, curNode.col-1, curNode))
        }
        if(validPosition(manifest_matrix, visited, curNode.row, curNode.col+1)){
            visited[curNode.row][curNode.col+1] = 1; // mark visited
            queue.push(new node(curNode.row, curNode.col+1, curNode))
        }
    }
    return false; // path not possible
}

function findClosestUnusedBFS(manifest_matrix, start, forbiddenColumns = [], forbiddenRows = []){
    const queue = [new node(start[0],start[1], false)];
    const visited = [...Array(10)].map(e => Array(12));
    while(queue.length > 0){
        const curNode = queue.shift();
        // end condition: If the slot is unused and the slot below it is not air & not a forbiddenColumn (which can include start column)
        if(!forbiddenColumns.includes(curNode.col) && !forbiddenRows.includes(curNode.row) && manifest_matrix[curNode.row][curNode.col].name === "UNUSED"){
            if(curNode.row-1 < 0 || (manifest_matrix[curNode.row-1][curNode.col].name !== "UNUSED")){
                const path = []
                let prevNode = curNode;
                while(prevNode){
                    path.unshift([prevNode.row, prevNode.col]);
                    prevNode = prevNode.prev;
                }
                return path; // return path
            }
        }
        if(validPosition(manifest_matrix, visited, curNode.row-1, curNode.col)){
            visited[curNode.row-1][curNode.col] = 1; // mark visited
            queue.push(new node(curNode.row-1, curNode.col, curNode))
        }
        if(validPosition(manifest_matrix, visited, curNode.row+1, curNode.col)){
            visited[curNode.row+1][curNode.col] = 1; // mark visited
            queue.push(new node(curNode.row+1, curNode.col, curNode))
        }
        if(validPosition(manifest_matrix, visited, curNode.row, curNode.col-1)){
            visited[curNode.row][curNode.col-1] = 1; // mark visited
            queue.push(new node(curNode.row, curNode.col-1, curNode))
        }
        if(validPosition(manifest_matrix, visited, curNode.row, curNode.col+1)){
            visited[curNode.row][curNode.col+1] = 1; // mark visited
            queue.push(new node(curNode.row, curNode.col+1, curNode))
        }
    }
    return false; // path not possible
}



function displayGraph(manifest_matrix, path = []){
    console.log("0 Empty | 1 NAN | 2 Container")
    for (let i = manifest_matrix.length-1; i>=0; i--){
        const row = manifest_matrix[i]
        //console.log(row)
        const row_str = [i/*+1*/+" ||"];
        for (let j = 0; j < row.length; j++){
            const col = row[j];
            let isInPath = false;
            for(let coord of path){
                if (coord[0] === i && coord[1] === j){
                    isInPath = true;
                } 
            }
            if (isInPath){
                row_str.push("x"); // path, they must be 0
            }else if (col.name === "UNUSED"){
                row_str.push("0"); // Empty
            }else if (col.name === "NAN"){
                row_str.push("1"); // NAN
            }else{
                row_str.push("2"); // Container 
            }
        }
        console.log(row_str.join("  "));
    }
    const equals = [];
    const x_axis = [];
    for(let i = 0; i< manifest_matrix[0].length; i++){
        equals.push("=");
        x_axis.push(i/*+1*/);
    }
    console.log("     ", equals.join("  "));
    console.log("     ", x_axis.join("  "))
}

// Sort array by smallest column first, containers with the same column are sorted by highest row first
function sortContainersLeftHigh(containers_to_unload){
    // sort containers to unload by column first, if columns are equal sort by row, highest first
    containers_to_unload.sort((a,b) => {
        if(a[1] > b[1]){ // if a's col is greater than b's col (further right), put a after b
            return 1;
        }else if (a[1] === b[1]){ // 
            if(a[0] > b[0]){ // if the columns are the same & a's row is greater than b's row (higher up), put a before b
                return -1;
            }else{
                return 1;
            }
        }else{
            return -1;
        }
    })
}

// tempRows is a list of the rows (0 indexed of course) ex: [0,9,10]
// return [[row,col]]
function containersInTemp(manifest_matrix, tempRows){
    const containers = []
    for(let row of tempRows){
        for(let i = 0; i<manifest_matrix[row].length; i++){
            if(manifest_matrix[row][i].name !== "UNUSED"){
                containers.push([row,i]);
            }
        }
    } 
    // sorts highest & left most
    sortContainersLeftHigh(containers)
    return containers;
}

module.exports = {node, step, shallow_extended_matrix, getFirstEmptyRowInCol, validPosition, bfs, findClosestUnusedBFS, displayGraph, containersInTemp, sortContainersLeftHigh}