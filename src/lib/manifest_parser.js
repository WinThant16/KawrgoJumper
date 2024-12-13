
class container{
    row;
    col;
    weight;
    name;
    constructor(row, col, weight, name){
        this.row = row;
        this.col = col;
        this.weight = weight;
        this.name = name;
    }
    clone(){
        return new container(this.row, this.col, this.weight, this.name);
    }
    swap(containerToSwapWith){
        //console.log("this ", this);
        //console.log("swapping ", containerToSwapWith)
        const containerClone = containerToSwapWith.clone();
        //console.log("clone", containerClone);
        containerToSwapWith.row = this.row;
        containerToSwapWith.col = this.col;
        containerToSwapWith.weight = this.weight;
        containerToSwapWith.name = this.name;

        this.row = containerClone.row;
        this.col = containerClone.col;
        this.weight = containerClone.weight;
        this.name = containerClone.name;
        //console.log("post this ", this);
        //console.log("post swapping ", containerToSwapWith)
        //console.log("post clone", containerClone);
    }
    clear(){
        this.weight = '00000';
        this.name = 'UNUSED';
    }
}

function parse_manifest(manifest_text){
    // replace carraige returns
    manifest_text = manifest_text.replaceAll("\r", "");
    // split manifest by new lines
    const lines = manifest_text.split("\n");
    // [row,col]
    const ship_grid = [...Array(8)].map(e => Array(12)); // 8 row , 12 col

    for (let line of lines){
        const groups = line.match(/^\[(\d\d),(\d\d)], {(\d{5})}, (.*)/);
        //console.log(groups)
        const row = groups[1];
        const col = groups[2];
        const weight = groups[3];
        const name = groups[4];
        const ship_container = new container(row, col, weight, name)

        ship_grid[Number(row)-1][Number(col)-1] = ship_container;
    }

    return ship_grid;

}

// return a manifest matrix back to the original file format
function matrix_to_string(manifest_matrix){
    const str = []
    for(let i=0; i<manifest_matrix.length; i++){
        for(let j=0; j<manifest_matrix[0].length; j++){ 
        const col = `[${manifest_matrix[i][j].row},${manifest_matrix[i][j].col}], {${manifest_matrix[i][j].weight}}, ${manifest_matrix[i][j].name}`
        str.push(col);
        }
    }
    return str.join("\n");
}

module.exports = {parse_manifest, matrix_to_string, container}