//The entry point
import { UserInteraction } from './user-Interaction';
import { chooseRadio, displayRangeNums, recalculateToMode, displayRangeNumsKeyboard, randomRangeValues } from './start-numbers';
import { handleUserInput, handleButton } from './user-cpu-amount';
import { setStatsBtnNode, changeStatsBtnActivity, getCurrentLevelNode, handleStatsButton, subscribesOnData } from './game-statistics';
import { getLevelInfoInstance } from './game-core';
import { setButtonToState, playButtonActivity, changeButtonActivity } from './start-stop-retry';
import { changePanels, resultOnInit } from './game-guide-result';
import { subscribesOnDataResult } from './game-guide-result';
import { activatePagination } from './pagination-results';

window.addEventListener('load',function(){
	run();
});

function run():void{
	//Timer
	const timer:HTMLDivElement = document.querySelector('.widget-game-timer')!;
	//Start numbers Even | Odd | Mixed
	const startNumsBlock:HTMLDivElement = document.querySelector('.widget-game-initial-numbers')!;
	if(startNumsBlock && startNumsBlock.firstChild){
		startNumsBlock.firstChild.addEventListener('click', function(this:HTMLDivElement, e: Event){
			chooseRadio(e);
		});
	}
	if(startNumsBlock && (startNumsBlock.lastChild instanceof HTMLDivElement)){
		const rangeBlock = (startNumsBlock.lastChild as HTMLDivElement).children[0];
		const randomRangeBlock = (startNumsBlock.lastChild as HTMLDivElement).children[1];
		if(rangeBlock instanceof HTMLDivElement){
			//Show numbers while dragging the sliders
			rangeBlock.children[1].addEventListener('input', function(this:HTMLInputElement, e: Event){
				rangeBlock.children[0].children[1].textContent = displayRangeNums(this);
			});
			rangeBlock.children[2].addEventListener('input', function(this:HTMLInputElement, e: Event){
				rangeBlock.children[0].children[3].textContent = displayRangeNums(this);
			});
			//Recalculate when mouse-up
			rangeBlock.children[1].addEventListener('mouseup', function(this:HTMLInputElement, e: Event){
				rangeBlock.children[0].children[1].textContent = displayRangeNums(this, true);
				//Visibility of the 'Play' button according to the selected numbers
				playButtonActivity();
			});
			rangeBlock.children[2].addEventListener('mouseup', function(this:HTMLInputElement, e: Event){
				rangeBlock.children[0].children[3].textContent = displayRangeNums(this, true);
				//Visibility of the 'Play' button according to the selected numbers
				playButtonActivity();
			});
			//Keyboard keys event
			rangeBlock.children[1].addEventListener('keyup', function(this:HTMLInputElement, e: Event){
				const key = (<KeyboardEvent>e).keyCode;
				if(key === 37 || key === 40){
					rangeBlock.children[0].children[1].textContent = displayRangeNums(this, true);
					//Visibility of the 'Play' button according to the selected numbers
					playButtonActivity();
				}
				if(key === 38 || key === 39){
					rangeBlock.children[0].children[1].textContent = displayRangeNumsKeyboard(this);
					//Visibility of the 'Play' button according to the selected numbers
					playButtonActivity();
				}
			});
			rangeBlock.children[2].addEventListener('keyup', function(this:HTMLInputElement, e: Event){
				const key = (<KeyboardEvent>e).keyCode;
				if(key === 38 || key === 39){
					rangeBlock.children[0].children[3].textContent = displayRangeNums(this, true);
					//Visibility of the 'Play' button according to the selected numbers
					playButtonActivity();
				}
				if(key === 37 || key === 40){
					rangeBlock.children[0].children[3].textContent = displayRangeNumsKeyboard(this);
					//Visibility of the 'Play' button according to the selected numbers
					playButtonActivity();
				}
			});
		}
		if(randomRangeBlock instanceof HTMLDivElement){
			randomRangeBlock.children[1].addEventListener('click', function(e: Event){
				if(e.target){
					randomRangeValues(e.target as HTMLInputElement);
					//Visibility of the 'Play' button according to the selected numbers
					playButtonActivity();
				}
			});
		}
	}
	//User and CPU amount
	const userAmountBlock:HTMLCollection = document.getElementsByClassName("widget-game-current-amount");
	if(userAmountBlock[0] instanceof HTMLDivElement){
		const userBlock:HTMLDivElement = (userAmountBlock[0]?.firstChild as HTMLDivElement);
		const userInput:HTMLInputElement = (userBlock.children[1]?.firstChild as HTMLInputElement);
		if(userInput instanceof HTMLInputElement){
			userInput.addEventListener('input', handleUserInput, false);
		}
		const userBtn:HTMLButtonElement = (userBlock?.lastChild as HTMLButtonElement);
		if(userBtn instanceof HTMLButtonElement){
			userBtn.addEventListener('click', handleButton, false);
		}
	}
	//Game statistics
	const statsBtn:HTMLButtonElement = document.querySelector('#openStatistics')!;
	setStatsBtnNode(statsBtn);
	changeStatsBtnActivity(true);
	if(statsBtn !== null){
		statsBtn.addEventListener('click', handleStatsButton); 	
	}
	getCurrentLevelNode(statsBtn);
	//Cube animation
	const cubeColl:HTMLCollection = document.getElementsByClassName('three-d-block')!;
	const cubeWrapperColl:HTMLCollection = document.getElementsByClassName('three-d-block-wrapper')!;
	const btnStart:HTMLButtonElement = document.getElementById('play')! as HTMLButtonElement;
	const btnStop:HTMLButtonElement = document.getElementById('stop')! as HTMLButtonElement;
	const btnRetry:HTMLButtonElement = document.getElementById('retry')! as HTMLButtonElement;
	if(btnStart && btnStop && btnRetry){
		setButtonToState(btnStart);
		btnStart.addEventListener('click', function(e: Event){
			UserInteraction.startGame(timer); 
		});
		setButtonToState(btnStop);
		btnStop.addEventListener('click', function(e: Event){
			UserInteraction.stopGame(timer);
		});
		setButtonToState(btnRetry);
		btnRetry.addEventListener('click', function(e: Event){
			if(!UserInteraction.gameInProgress){
				UserInteraction.gameInProgress = true;
				//Subscribers for data levels
				getLevelInfoInstance().subscribe(subscribesOnData);
				getLevelInfoInstance().subscribe(subscribesOnDataResult);
				//Setting the 'retry' button as inactive
				changeButtonActivity('retry', false);
			}
		});
	}
	if(timer){
		UserInteraction.initBeforeGame(timer);
	}
	//Get the main HTML block of the pagination
	const paginationBlock:HTMLDivElement = (document.querySelector('.pagination-block')! as HTMLDivElement);
	activatePagination(paginationBlock);
	//Display the game guide and result page if the data already exists
	const resultsPanel:HTMLElement = (document.querySelector('.content__result')! as HTMLElement);
	resultOnInit(resultsPanel);
	//The game guide button and result page button
	const navGuideBtn:HTMLButtonElement = (document.querySelector('.content__navigation_guide')! as HTMLButtonElement);
	const navResultBtn:HTMLButtonElement = document.querySelector('.content__navigation_result')! as HTMLButtonElement;
	if((navGuideBtn !== null) && (navResultBtn !== null)){
		navGuideBtn.addEventListener('click', changePanels, false);
		navResultBtn.addEventListener('click', changePanels, false);
	}
}