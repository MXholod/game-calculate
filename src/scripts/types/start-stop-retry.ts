export interface IButton{
	button: (null | HTMLButtonElement);
	activity: boolean;
}

export interface IButtonsState<T>{
	startButton: T;
	stopButton: T;
	retryButton: T;
}

export type ButtonsState = IButtonsState<IButton>; 

export type setBtnState = (btn:HTMLButtonElement)=>void;
export type changeBtnActivity = (btnName:string, activity:boolean)=>boolean;