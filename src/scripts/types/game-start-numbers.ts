export type ButtonNumberMode = [string, boolean];
export type ButtonRandom = [number, boolean];

interface IStartNumbersBlock<BtnMode, BtnRand>{
	buttonMode: Array<BtnMode>,
	buttonRandom: BtnRand
}

export type StartNumsBlock = IStartNumbersBlock<ButtonNumberMode, ButtonRandom>;