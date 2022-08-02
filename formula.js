for(let i=0; i<rows; i++){
    for(let j=0; j<cols; j++){
      let cell = document.querySelector(`.cell[rid = "${i}"][cid = "${j}"]`);
      cell.addEventListener("blur", (e) => {
          let address = addressBar.value;
          let [activeCell, cellProp] = getCellAndCellProp(address);
          let enteredData = activeCell.innerText;
          
          if(enteredData === cellProp.value) return;

          cellProp.value = enteredData;
          
          //if data modified update children with new hardcoded value and remove p-c relation and formula empty
          removeChildFromParent(cellProp.formula);
          cellProp.formula = "";
          updateChildrenCells(address);
        //   console.log(cellProp);
      })
    }
}

//formula evaluation enter key
//1)normal expression - ( 10 + 20 )
//2)dependency expression - ( A1 + A2 + 10 );
let formulaBar = document.querySelector(".formula-bar");

formulaBar.addEventListener("keydown", async (e) => {
    let inputFormula = formulaBar.value;
    if(e.key === "Enter" && inputFormula){
        //To get result of experession
        let evaluatedValue = evaluateFormula(inputFormula);
        
        //if change iin formula, break old P-C relation,
        //evaluate new formula,
        //add new P-C relation
        let address = addressBar.value;
        let[cell, cellProp] = getCellAndCellProp(address);
        if(inputFormula !== cellProp.formula) removeChildFromParent(cellProp.formula);
        
        addChildToGraphComponent(inputFormula, address);
        
        //TRUE -> Cycle , False -> Not Cyclie
        let cycleResponse = isGraphCyclic(graphComponentMatrix);
        if(cycleResponse){
            alert("Your formula is cyclic");
            let response = confirm("Your formula is cyclic . do you want to trace your Path ?");
            
            while(response === true){
                //keep on tracking color until user is satisfied
                await isGraphCyclicTracePath(graphComponentMatrix, cycleResponse);
                response = confirm("Your formula is cyclic . do you want to trace your Path ?");
            }

            removeChildFromGraphComponent(inputFormula, childAddress);
            return;
        }

        //To update UI and cellProp in DB
        setCellUIAndCellProp(evaluatedValue, inputFormula, address);
        addChildToParent(inputFormula);

        updateChildrenCells(address);
    }
})


function addChildToGraphComponent(formula, childAddress){
    let[crid,ccid] = decodeRIDCIDFromAddress(childAddress);
    let encodedFormula = formula.split(" ");

    for(let i=0; i<encodedFormula.length; i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90){
            let[prid, pcid] = decodeRIDCIDFromAddress(encodedFormula[i]);
            //B1 : A1 + 10
            //rid : i , cid : j
            graphComponentMatrix[prid][pcid].push([crid,ccid]);
        }
    }

}

function removeChildFromGraphComponent(){
    let[crid,ccid] = decodeRIDCIDFromAddress(childAddress);
    let encodedFormula = formula.split(" ");

    for(let i=0; i<encodedFormula.length; i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90){
            let[prid, pcid] = decodeRIDCIDFromAddress(encodedFormula[i]);
            graphComponentMatrix[prid][pcid].pop();
        }
    }


}


function updateChildrenCells(parentAddress){
    let [parentCell, parentCellProp] = getCellAndCellProp(parentAddress);
    let children = parentCellProp.children;

    for(let i=0; i<children.length; i++){
        let childAddress = children[i];
        let[childCell, childCellProp] = getCellAndCellProp(childAddress);
        let childFormula = childCellProp.formula;

        let evaluatedValue = evaluateFormula(childFormula);
        setCellUIAndCellProp(evaluatedValue, childFormula, childAddress);
        updateChildrenCells(childAddress); 
    }

}



function addChildToParent(formula){
    //condition for formula is it should be space separated
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");

    for(let i=0; i<encodedFormula.length; i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90){
            let [parentcell,parentcellProp] = getCellAndCellProp(encodedFormula[i]);
            parentcellProp.children.push(childAddress);
        }
    }

}


function removeChildFromParent(formula){
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");

    for(let i=0; i<encodedFormula.length; i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90){
            let [parentcell,parentcellProp] = getCellAndCellProp(encodedFormula[i]);
            let idx = parentcellProp.children.indexOf(childAddress);
            parentcellProp.children.splice(idx, 1);
        }
    }
}



function evaluateFormula(formula){
    //condition for formula is it should be space separated
    let encodedFormula = formula.split(" ");

    for(let i=0; i<encodedFormula.length; i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90){
            let [cell,cellProp] = getCellAndCellProp(encodedFormula[i]);
            encodedFormula[i] = cellProp.value;
        }
    }

    let decodedFormula = encodedFormula.join(" ");
    return eval(decodedFormula);
}


function setCellUIAndCellProp(evaluatedValue, formula, address){
    // let address = addressBar.value;
    let[cell, cellProp] = getCellAndCellProp(address);
    
    //UI updates
    cell.innerText = evaluatedValue;

    //DB updates
    cellProp.value = evaluatedValue;
    cellProp.formula = formula;
}


//first establish parent child relationship










