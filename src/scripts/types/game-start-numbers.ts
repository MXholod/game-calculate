export type ButtonNumberMode = [string, boolean];
export type RangeNumbers = [string, string];

interface IRadiosElems{
	mixed: HTMLInputElement | null;
	even: HTMLInputElement | null;
	odd: HTMLInputElement | null;
}

interface ISliderBlockNodes{
	mainSliderBlock: HTMLDivElement | null;
	outputFrom: HTMLOutputElement | null;
	outputTo: HTMLOutputElement | null;
	leftSlider: HTMLInputElement | null;
	rightSlider: HTMLInputElement | null;
}

interface IRandomNums{
	leftInp: HTMLInputElement | null;
	rightInp: HTMLInputElement | null;
}

interface ISignNums{
	plus: HTMLInputElement | null;
	mines: HTMLInputElement | null;
	division: HTMLInputElement | null;
	multiplication: HTMLInputElement | null;
	all: HTMLInputElement | null;
}

interface IStartNumbersBlock<BtnMode, RangeNums, SignNums>{
	radioBtnElems: IRadiosElems;
	buttonMode: Array<BtnMode>;
	rangeNumbers: RangeNums;
	sliderBlockNodes: ISliderBlockNodes;
	randomInputs: IRandomNums;
	signs: SignNums
}

export type StartNumsBlock = IStartNumbersBlock<ButtonNumberMode, RangeNumbers, ISignNums>;

export type chooseRadioMode = (event: Event)=>void;

export type rememberRangeSliderNodes = (timer:HTMLDivElement)=>boolean;

export type updateRangeSliderNodes = (currentLevelIndex: number)=>boolean;

export type processRangeMode = (rangeMode: string)=>boolean;

export type changeModeToCurrent = (numValue:string)=>void;

export type displayRange = (rangeInput:HTMLInputElement, recalc?:boolean)=>string;

export type saveInpValWithRecalc = (elemName:string, value:string, recalc:boolean)=>(string | undefined);

export type recalculateValToMode = ()=>void;

export type rangeNumsKeyboard = (rangeInput:HTMLInputElement)=>string;

export type turnOnOffStartNums = (onOrOff:boolean)=>boolean;

export type resetValsOnEndLevel = ()=>void;

export type randRangeValues = (randomInputBtn:HTMLInputElement)=>void;

export type cacheRadButtons = (gameInitalNumbers:HTMLDivElement)=>void;

export type resetCacheRadButtons = ()=>void;

export type saveSignSelection = (signSelectionEleme:HTMLDivElement)=>void;

export type signSelection = (this:HTMLDivElement, e:MouseEvent)=>void;

export type checkedToAllSigns = ()=>boolean;

export type setSignsSel = (toggle:boolean)=>void;