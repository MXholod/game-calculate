import { mainSquare, threeDBlockWrapper, threeDBlock, ISQuareBlock, startCube, backCube, IAppllyNumsToCube, clearNumsCube } from './types/main-cube';
import { UserInteraction } from './user-Interaction';

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
				cells[i].textContent = nums[i];
				cells[i].setAttribute("data-cell-value", nums[i]);
				cells[i].setAttribute("class", `level-cell-${UserInteraction.gameLevel}`);
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
//Delete all the children cubes with numbers in the main cube
export const clearNumsOfCube:clearNumsCube = ():boolean=>{
	const block:HTMLDivElement = (blocks!.threeB) as HTMLDivElement;
	const blockNumbers:HTMLDivElement = (block!.firstChild) as HTMLDivElement;
	if(blockNumbers){
		//Delete all children cubes with numbers
		while(blockNumbers.firstChild){
			blockNumbers.removeChild(blockNumbers.firstChild);
		}
		return true;
	}
	return false;
}