export type ButtonNumberMode = [string, boolean];
export type RangeNumbers = [string, string];

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

interface IStartNumbersBlock<BtnMode, RangeNums>{
	buttonMode: Array<BtnMode>;
	rangeNumbers: RangeNums;
	sliderBlockNodes: ISliderBlockNodes;
	randomInputs: IRandomNums;
}

export type StartNumsBlock = IStartNumbersBlock<ButtonNumberMode, RangeNumbers>;

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