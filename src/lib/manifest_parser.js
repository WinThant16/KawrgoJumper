
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

console.log(parse_manifest(require("fs").readFileSync("./ShipCase1.txt", "utf-8")))