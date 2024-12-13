const {readFileSync} = require("fs");
//const manifest_text = readFileSync("./ShipCase1.txt", {encoding: "utf-8"});
const {parse_manifest, container} = require("./manifest_parser");

//const manifest_matrix = parse_manifest(manifest_text);

const {shallow_extended_matrix, sortContainersLeftHigh, getFirstEmptyRowInCol, findClosestUnusedBFS, displayGraph, step, containersInTemp} = require("./taskcommon")

// containers_to_unload is an array of positions [[1,2],[3,4]], 0 indexed
function computeUnload(manifest_matrix, containers_to_unload){

    const forbidden_rows = []
    const copy = shallow_extended_matrix(manifest_matrix, forbidden_rows)
    // console.log(copy);
    manifest_matrix = copy;
    // Sort array by smallest column first, containers with the same column are sorted by highest row first
    sortContainersLeftHigh(containers_to_unload);
    
    const steps = []; // array of steps

    // start at first container to unload
    //for (let i = 0; i < containers_to_unload.length; i++){
    while(containers_to_unload.length > 0){
        // const target = containers_to_unload[i]
        const target = containers_to_unload[0];
        // STEP 1: dig to container, if needed (while the top container in a column is not the target)
        console.log("=============================================STEP 1: DIG=============================================")
        let top_container_row = getFirstEmptyRowInCol(manifest_matrix, target[1]) - 1; // returns row
        while(top_container_row !== target[0]){
            // lets try with columns we'll access later as forbidden
            let forbidden_columns = []; 
            for(const container of containers_to_unload){
                forbidden_columns.push(container[1]);
            }
            const source = [top_container_row, target[1]];
            console.log("source", source)
            const path = findClosestUnusedBFS(manifest_matrix, source, forbidden_columns);
            const destination = path[path.length-1];
            //console.log(source)
            // push steps
            steps.push(new step(source, destination, path));
            // actually move it
            console.log("Moving " + source + " to " + destination);
            manifest_matrix[source[0]][source[1]].swap(manifest_matrix[destination[0]][destination[1]]);
            displayGraph(manifest_matrix, path)
            top_container_row = getFirstEmptyRowInCol(manifest_matrix, target[1]) - 1; // returns row
        }
        // STEP 2: Unload the target container
        console.log("=============================================STEP 2: Unload the target container=============================================")
        const path = [];
        // move up
        for (let i = target[0]; i<manifest_matrix.length; i++){
            path.push([i,target[1]]);
        }
        // move left
        for (let i = target[1]; i>=0; i--){
            path.push([manifest_matrix.length-1, i]);
        }
        steps.push(new step(target, "TRUCK", path));
        manifest_matrix[target[0]][target[1]].clear();
        displayGraph(manifest_matrix,path)
        // STEP 3: Return containers that are in the 2 high temp zone
        console.log("=============================================STEP 3: Return containers that are in the 2 high temp zone=============================================")
        const containers_in_temp = containersInTemp(manifest_matrix, forbidden_rows);
        for(let container of containers_in_temp){
            // lets try with columns we'll access later as forbidden
            const forbidden_columns = [];
            for(const container of containers_to_unload){
                forbidden_columns.push(container[1]);
            }
            const source = container;
            const path = findClosestUnusedBFS(manifest_matrix, source, forbidden_columns, forbidden_rows);
            const destination = path[path.length-1];
            // push steps
            steps.push(new step(source, destination, path));
            // actually move it
            console.log("Moving " + source + " to " + destination);
            manifest_matrix[source[0]][source[1]].swap(manifest_matrix[destination[0]][destination[1]]);
            displayGraph(manifest_matrix, path)
            top_container_row = getFirstEmptyRowInCol(manifest_matrix, target[1]) - 1; // returns row
        }
        containers_to_unload.shift();
    }
    return steps;
}
//const path = findClosestUnusedBFS(manifest_matrix, [1,2], [2,1]);
//displayGraph(manifest_matrix, path);

//displayGraph(manifest_matrix);
//console.log(getFirstEmptyRowInCol(manifest_matrix, 1));

//let steps = computeUnload(manifest_matrix, [[0,1]]);
//console.log(steps)

// basically pick closest unused slot a bunch of times
function computeLoad(manifest_matrix, amount){
    const forbiddenRows = [];
    const copy = shallow_extended_matrix(manifest_matrix, forbiddenRows);
    manifest_matrix = copy;

    const steps = [];
    const source = [8,0]; //left most right above the edge of the ship
    for (let i = 0; i < amount; i++){
        const path = findClosestUnusedBFS(manifest_matrix, source, [], forbiddenRows);
        steps.push(new step(source, path[path.length-1], path));
    }
    return steps;
}

module.exports = {computeUnload, computeLoad};