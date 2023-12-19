export interface ILevelStatistics{
	idLevel: number;
	pointsLevel: number;
} 

export type LevelList = Array<ILevelStatistics>;

export interface IStatistics extends ILevelStatistics{
	totalLevelAmount: number;
	buttonState: boolean;
} 