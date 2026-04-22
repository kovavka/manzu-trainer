import {WaitPatternType} from "./WaitPatternType";

export interface WaitPattern {
    tiles: number[]
    type: WaitPatternType
    tilesToComplete: number[]
}

export interface HandStructure {
    sets: number[][]
    unusedTiles: number[]
    waitPatterns: WaitPattern[]
    pair: number | undefined
    remainingTiles: number[]
}

export interface WaitStructure {
    sets: number[][]
    waitPatterns: WaitPattern[]
    pair: number | undefined
}
