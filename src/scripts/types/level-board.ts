import { ILimitLevel, ILimitLevelValues } from './user-interaction';

export type curLevel = ILimitLevel<ILimitLevelValues>;

export type toggleLBoard = (timer:HTMLDivElement, move:boolean)=>boolean;

export type updateLBoard = (levelBoard:HTMLDivElement, currentLevel:curLevel)=>boolean;