import { mainSquare, threeDBlockWrapper, threeDBlock, ISQuareBlock, startCube, backCube, IAppllyNumsToCube, clearNumsCube, clickOnCubeCells, ICell, cubeCells, allowClickCells, disallowClickCells, ICalculateCorrectResult } from './types/main-cube';
import { UserInteraction } from './user-Interaction';
import { allowUserAmount } from './user-cpu-amount';

//The state of all cells in the cube
let cubeCellsState:cubeCells = [];

//There is an EventHandler function or null
let cellsEventHandler:clickOnCubeCells | null = null;

const blocks:ISQuareBlock = {
	mainS: null,
	threeBW: null,
	threeB: null
}
//Start main cube animation 
export const startCubeAnimation:startCube = (timer:HTMLDivElement, animationEnd?: ()=>void):boolean=>{
	const mainSquareElem: mainSquare = (timer?.parentNode?.parentNode?.firstChild?.lastChild) as HTMLDivElement;
	const threeDBlockWrapperElem: threeDBlockWrapper = (mainSquareElem?.firstChild) as HTMLDivElement;
	const threeDBlockElem: threeDBlock = (threeDBlockWrapperElem?.firstChild) as HTMLDivElement;
	//Save main cube nodes into the object
	if(mainSquareElem && threeDBlockWrapperElem && threeDBlockElem){
		blocks.mainS = mainSquareElem;
		blocks.threeBW = threeDBlockWrapperElem;
		blocks.threeB = threeDBlockElem;
	}else{
		return false;
	}
	if(blocks.threeBW.classList.contains("three-d-block-wrapper-rewind") && blocks.threeB.classList.contains('three-d-block-rewind')){
		blocks.threeBW.classList.remove("three-d-block-wrapper-rewind");
		blocks.threeB.classList.remove("three-d-block-rewind");
		blocks.threeBW.classList.add("three-d-block-wrapper");
		blocks.threeB.classList.add("three-d-block");
	}
	//Run the cube animation
	blocks.threeBW.style.animationPlayState = "running";
	blocks.threeB.style.animationPlayState = "running";
	//Call function when animation end
	if(typeof animationEnd === 'function'){
		blocks.threeB.onanimationend = ()=>{  animationEnd(); }
		return true;
	}
	return true;
}
//Rewind main cube animation
export const backCubeAnimation:backCube = (animationEnd?:()=>void):boolean=>{
	if(blocks.threeBW === null || blocks.threeB === null) return false;
	if(blocks.threeBW.classList.contains("three-d-block-wrapper") && blocks.threeB.classList.contains('three-d-block')){
		blocks.threeBW.classList.remove("three-d-block-wrapper");
		blocks.threeB.classList.remove("three-d-block");
		blocks.threeBW.classList.add("three-d-block-wrapper-rewind");
		blocks.threeB.classList.add("three-d-block-rewind");
	}
	//Run the cube animation
	blocks.threeBW.style.animationPlayState = "running";
	blocks.threeB.style.animationPlayState = "running";
	//Call function when animation end
	if(typeof animationEnd === 'function'){
		blocks.threeB.onanimationend = ()=>{  animationEnd(); }
		return true;
	}
	return true;
}
//Merge number values with elements and append them to the main 
export const appllyNumsToCube:IAppllyNumsToCube = (cells: HTMLDivElement[], nums:Array<string>):boolean=>{
	if(cells.length === nums.length){
		let blockNumbers:(HTMLDivElement | null) = null; 
		for(let i = 0; i < cells.length; i++){
			if(cells[i] instanceof HTMLDivElement){
				const [sign, num ] = nums[i].split(" ");
				cells[i].textContent = num;
				cells[i].setAttribute("data-cell-sign", sign);
				cells[i].setAttribute("data-cell-value", num);
				cells[i].setAttribute("class", `level-cell-${UserInteraction.gameLevel}`);
					const span:HTMLSpanElement = document.createElement("SPAN") as HTMLSpanElement;
					span.textContent = sign;
				cells[i].appendChild(span);
				const block:HTMLDivElement = (blocks!.threeB) as HTMLDivElement;
				blockNumbers = (block!.firstChild) as HTMLDivElement;
				blockNumbers.appendChild(cells[i]);
			}
		}
		if(blockNumbers instanceof HTMLDivElement){
			const cubesLine = (UserInteraction.gameLevel + 1);
			blockNumbers.style.gridTemplate = `repeat(${cubesLine}, 1fr) / repeat(${cubesLine}, 1fr)`;
		}
		return true;
	}
	return false;
}
//Delete all the child cubes with numbers in the main cube
export const clearNumsOfCube:clearNumsCube = ():boolean=>{
	const block:HTMLDivElement = (blocks!.threeB) as HTMLDivElement;
	const blockNumbers:HTMLDivElement = (block!.firstChild) as HTMLDivElement;
	if(blockNumbers){
		//Delete all children cubes with numbers
		while(blockNumbers.firstChild){
			blockNumbers.removeChild(blockNumbers.firstChild);
		}
		//Reset temporary state of main cube by default
		cubeCellsState = [];
		return true;
	}
	return false;
}
//Click on cube cells during the level of the game
export const allowClickOnCubeCells:allowClickCells = function():boolean{
	if(blocks.threeBW && (cellsEventHandler === null)){
		cellsEventHandler = function(this:HTMLDivElement, event:MouseEvent):void{
			//If amount of opened cells is less than the cubes amount
			if(cubeCellsState.length < UserInteraction.cubesAmount){
				//Click on a cell
				if(event.target instanceof HTMLDivElement){
					const cellDiv:HTMLDivElement = (event.target) as HTMLDivElement;
					//If element has sign and number values
					if(cellDiv?.dataset.cellSign && cellDiv?.dataset.cellValue){
						//Obtaining sign and number values
						let cellSign:string = cellDiv?.dataset.cellSign;
						let cellValue:number = parseInt(cellDiv?.dataset.cellValue);
						//Erasing values to prevent repeat data retrieving
						cellDiv.dataset.cellSign = "";
						cellDiv.dataset.cellValue = "";
						//Initial object
						let data:ICell = { order:0 , sign:"", value:cellValue };
						//If it is the first cell, erase its sign and leave only the number
						if(!cubeCellsState.length){
							if(cellDiv!.lastChild instanceof HTMLSpanElement){
								cellDiv.removeChild(cellDiv!.lastChild);
							}
							//Save data
							data = { ...data, order:1 , sign:"" };
							cubeCellsState.push(data);
						}else{
							//Save data to the state
							const lastEl = cubeCellsState[(cubeCellsState.length - 1)];
							data = { ...data, order:(lastEl.order+1), sign:cellSign };
							cubeCellsState.push(data);
							//If all cells uncovered
							if(cubeCellsState.length === UserInteraction.cubesAmount){
								//Calculate correct CPU result
								const cpuResult = calculateCorrectResult(cubeCellsState);
								const levelInfo = { allCubeCells: cubeCellsState, cpuResult };
								//Show panel for the user result
								allowUserAmount(blocks.mainS as HTMLDivElement, levelInfo);
								//Reset temporary level array
								cubeCellsState = [];
							}
						}
						//Remove cover
						cellDiv?.style.setProperty("--cubeCellCover","none");
					}
				}
			}
		};
		//Subscribe on 'click' event
		blocks.threeBW.addEventListener("click", cellsEventHandler);
		return true;
	}
	return false;
}
export const disallowClickOnCells:disallowClickCells = ():boolean=>{
	if(cellsEventHandler !== null){
		blocks!.threeBW!.removeEventListener("click",cellsEventHandler);
		cellsEventHandler = null;
		return true;
	}
	return false;
}
export const calculateCorrectResult:ICalculateCorrectResult = (allCells: cubeCells):number=>{
	const cellsArr:cubeCells = allCells.sort((a:ICell,b:ICell):(0 | 1 | -1)=>{
		if(a?.order > b?.order){ return 1; }
		else if(a?.order < b?.order){ return -1; }
		else{ return 0; } //(a?.order === b?.order)
	});
	let sum:number = 0;
	for(let cell of cellsArr){
		if(cell.sign === ''){
			sum = cell.value;
			continue;
		}
		switch(cell.sign){
			case '(+)' : sum += (cell.value); 
			break;
			case '(-)' : sum -= (cell.value); 
			break;
			case '(*)' : sum *= (cell.value); 
			break;
			case '(/)' : sum /= (cell.value); 
			break;
		}
	}
	if(Number.isInteger(sum)){
		return sum;
	}else{
		return Number(sum.toFixed(3));
	}
}