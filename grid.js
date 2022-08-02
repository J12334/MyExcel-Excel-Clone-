let rows = 100;
let cols = 26;

let addressColCont = document.querySelector(".address-col-cont");
let addressRowCont  = document.querySelector(".address-row-cont");
let cellscont = document.querySelector(".cells-cont");
let addressBar = document.querySelector(".address-bar");

for(let i=0; i<rows; i++){
    let addressCol = document.createElement("div");
    addressCol.setAttribute("class","address-col");
    addressCol.innerText = i+1;
    addressColCont.appendChild(addressCol);
}

for(let i=0; i<cols; i++){
    let addressRow = document.createElement("div");
    addressRow.setAttribute("class","address-row");
    addressRow.innerText = String.fromCharCode(65 + i);
    addressRowCont.appendChild(addressRow);
}


for(let i=0; i<rows; i++){
    let rowcont = document.createElement("div");
    rowcont.setAttribute("class","row-cont");
    for(let j=0; j<cols; j++){
       let cell = document.createElement("div");
       cell.setAttribute("class","cell");
       cell.setAttribute("contenteditable","true");
       cell.setAttribute("spellcheck", "false");

       //attributes for cell and storage identification
       cell.setAttribute("rid",i);
       cell.setAttribute("cid",j);
    //    cell.addEventListener("click", (e) => {
    //     let rowID = i + 1;
    //     let colID = String.fromCharCode(65 + j);
    //     addressBar.value = `${colID}${rowID}`;
    //    });
       rowcont.appendChild(cell);
       addListenerForAdressBarDisplay(cell,i,j);
    }
    cellscont.appendChild(rowcont);
}


function addListenerForAdressBarDisplay(cell , i, j){
  cell.addEventListener("click", (e) => {
    let rowID = i + 1;
    //creating string from ascii value of character
    let colID = String.fromCharCode(65 + j);
    addressBar.value = `${colID}${rowID}`;
    // addressBar.innerText = colID + rowID;
    // console.log(colID + rowID);
  });
}

//JS Object mein key value ke form mein store kar sakte hoon
//Storgae [2d matrix with objects]





















