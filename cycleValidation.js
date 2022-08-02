//Storage -> 2D Matrix (Basic Needed)
let collectedGraphComponent = [];
let graphComponentMatrix = [];

// for (let i = 0; i < rows; i++) {
//     let row = [];

//     for (let j = 0; j < cols; j++) {
//         //Why array -> more than one child relation(dependency)
//         row.push([]);
//     }

//     graphComponentMatrix.push(row);
// }

//TRUE -> Cycle, False -> Not Cyclic
function isGraphCyclic(graphComponentMatrix) {
    //Dependency -> visited, dfsvisited(2D Array)
    let visited = []; //Track Node visit
    let dfsVisited = []; //Track Stack visit

    for (let i = 0; i < rows; i++) {
        let visitedRow = [];
        let dfsVisitedRow = [];

        for (let j = 0; j < cols; j++) {

            visitedRow.push(false);
            dfsVisitedRow.push(false);

        }

        visited.push(visitedRow);
        dfsVisited.push(dfsVisitedRow);

    }



    for (let i = 0; i < rows; i++) {

        for (let j = 0; j < cols; j++) {

            if (visited[i][j] === false) {

                let response = dfsCycleDetection(graphComponentMatrix, i, j, visited, dfsVisited);
                if (response == true) {
                    return [i,j];
                }

            }

        }

    }

    return null;

}


//Start -> vis(true) , dfsVis(true)
//End   -> dfsVis(false)
//if vis[i][j] === true -> already explored, go back
//Cycle Detection condition -> if(vis[i][j] == true && dfsVis[i][j] == true) --> Cycle
//Return -> True/False;
//True -> Cyclic, False -> Not Cyclic
function dfsCycleDetection(graphComponentMatrix, srcr, srcc, visited, dfsVisited) {

    visited[srcr][srcc] = true;
    dfsVisited[srcr][srcc] = true;

    //A1 -> [[0,1], [1,0], [5,10],......... ]
    for (let children = 0; children < graphComponentMatrix[srcr][srcc].length; children++) {
        let [nbrr, nbrc] = graphComponentMatrix[srcr][srcc][children];

        if (visited[nbrr][nbrc] === false) {
            let response = dfsCycleDetection(graphComponentMatrix, nbrr, nbrc, visited, dfsVisited);
            if (response === true) {
                return true; //found cycle to return immediately, no need to explore more path
            }
        } else if (visited[nbrr][nbrc] === true && dfsVisited[nbrr][nbrc] === true) {
            return true; //found cycle to return immediately, no need to explore more path
        }

    }

    dfsVisited[srcr][srcc] = false;

    return false;
}