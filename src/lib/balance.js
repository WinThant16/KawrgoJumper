const { readFileSync } = require("fs");

const {
  shallow_extended_matrix,
  getFirstEmptyRowInCol,
  displayGraph,
  step,
  bfs,
} = require("./taskcommon");

const { Heap } = require("heap-js");

// get left and right most walls [leftwall, rightnanwall] (gets the leftmost and rightmost non NAN slots)
function getWalls(manifest_matrix) {
  const walls = [manifest_matrix[0].length - 1, 0]; // init with right limit, left limit
  for (let i = 0; i < manifest_matrix.length; i++) {
    for (let j = 0; j < manifest_matrix[0].length; j++) {
      if (manifest_matrix[i][j].name !== "NAN") {
        if (j < walls[0]) {
          walls[0] = j;
        }
        if (j > walls[1]) {
          walls[1] = j;
        }
      }
    }
  }
  return walls;
}
// compute weight of left (port) & right (starboard) sides of the ship
// return [leftwight, rightweight]
function computeWeights(manifest_matrix, walls) {
  const mid = (walls[0] + walls[1]) / 2; // ships are symmetric, cant be odd, this will be the left slot from the middle

  const weights = [0, 0];
  for (let i = 0; i < manifest_matrix.length; i++) {
    for (let j = 0; j < manifest_matrix[0].length; j++) {
      const container = manifest_matrix[i][j];
      if (container.name !== "NAN" && container.name !== "UNUSED") {
        if (j <= mid) {
          weights[0] += Number(container.weight);
        } else {
          weights[1] += Number(container.weight);
        }
      }
    }
  }
  return weights;
}

function containersByWeight(manifest_matrix) {
  const containers = [];
  for (let i = 0; i < manifest_matrix.length; i++) {
    for (let j = 0; j < manifest_matrix[0].length; j++) {
      containers.push(manifest_matrix[i][j]);
    }
  }
  containers.sort((a, b) => {
    return Number(b) - Number(a);
  });
  return containers;
}


function deepCopyManifest(manifest_matrix) {
  const copy = [];
  for (let i = 0; i < manifest_matrix.length; i++) {
    const row = [];
    for (let j = 0; j < manifest_matrix[0].length; j++) {
      row.push(manifest_matrix[i][j].clone());
    }
    copy.push(row);
  }
  return copy;
}

function shallowCopyArray(arr) {
  const copy = [];
  for (let item of arr) {
    copy.push(item);
  }
  return copy;
}

class state {
  manifest_matrix; // state
  steps; // steps taken to reacht this state
  cost; // cost of those steps
  constructor(
    manifest_matrix,
    steps,
    cost,
  ) {
    this.manifest_matrix = manifest_matrix;
    this.steps = steps;
    this.cost = cost;
  }
  clone() {
    return new state(
      deepCopyManifest(this.manifest_matrix),
      shallowCopyArray(this.steps),
      this.cost,
    );
  }
}

function weightsBalanced(weights) {
  if (weights[0] == weights[1]) {
    return true;
  } else if (weights[0] > weights[1]) {
    if (weights[1] * 1.1 >= weights[0]) {
      return true;
    } else {
      return false;
    }
  } else {
    if (weights[0] * 1.1 >= weights[1]) {
      return true;
    } else {
      return false;
    }
  }
}

function getMoves(manifest_matrix, walls) {
  const valid_slots = [];
  for (let col = walls[0]; col <= walls[1]; col++) {
    let first_empty_row = getFirstEmptyRowInCol(manifest_matrix, col);
    if (first_empty_row !== undefined) {
      valid_slots.push([first_empty_row, col]);
    }
  }
  return valid_slots;
}

const stateComparator = (a, b) => a.cost - b.cost;


// returns a state object
// state.manifest_matrix contains updated manifest_matrix
// state.cost contains cost without moving crane back
// state.steps contains steps
function computeBalance(manifest_matrix) {
  const walls = getWalls(manifest_matrix);
  const mid = (walls[0] + walls[1]) / 2;
  const state_heap = new Heap(stateComparator); // heap of exploration paths sorted by cost, obviously we want to pursue cheaper paths first

  // this is gonna get so expensive
  let iterations = 0;
  const forbidden_rows = [];
  manifest_matrix = shallow_extended_matrix(manifest_matrix, forbidden_rows);

  // prepare initial state
  const initial_state = new state(manifest_matrix, [], 0);
  const weights = computeWeights(manifest_matrix, walls);
  if (weightsBalanced(weights)) {
    // initial exit condition
    return initial_state;
  }

  // didnt exit, so lets begin
  state_heap.push(initial_state);
  while (state_heap.size() > 0) {
    // if this triggers then its not possible
    const cur_state = state_heap.pop();
    const manifest_matrix = cur_state.manifest_matrix;
    const moves = getMoves(manifest_matrix, walls);
    // for every moveable container
    for (let i = 0; i < manifest_matrix.length; i++) {
      for (let j = 0; j < manifest_matrix.length; j++) {
        if (
          manifest_matrix[i][j] !== "NULL" &&
          manifest_matrix[i][j] !== "UNUSED"
        ) {
          
          // for every position we can move the container
          const start = [i, j];
          for (const dest of moves) {
            iterations += 1;
            if(dest[1] === j) continue; // dont process moves in the same column
            const path = bfs(manifest_matrix, start, dest);
            if (!path){// if bfs returns false, path not possible
                continue;
            }
            const state_clone = cur_state.clone();
            const new_step = new step(start, dest, path);
            state_clone.manifest_matrix[start[0]][start[1]].swap(
                state_clone.manifest_matrix[dest[0]][dest[1]]
            );
            state_clone.steps.push(new_step);
            state_clone.cost += path.length;
            const weights = computeWeights(state_clone.manifest_matrix, walls);
            if (weightsBalanced(weights)) {
              // if this is a solution return it
              console.log(iterations);
              state_clone.manifest_matrix.pop()
              state_clone.manifest_matrix.pop() // remove rows 10 and 11 that we added
              return state_clone;
            }
            state_heap.push(state_clone);
          }
        }
      }
    }
  }
  return false;
}

module.exports = {computeBalance}


//const manifest_text = readFileSync("./SilverQueen.txt", { encoding: "utf-8" });
//const { parse_manifest, container } = require("./manifest_parser");

//const manifest_matrix = parse_manifest(manifest_text);

//const res_state = computeBalance(manifest_matrix);
//console.log(res_state.steps.length)
//displayGraph(shallow_extended_matrix(manifest_matrix));
//displayGraph(shallow_extended_matrix(res_state.manifest_matrix));


