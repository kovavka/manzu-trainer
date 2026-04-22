import {ScreenType} from "../types/ScreenType";
import signals from 'signals';
import {TempaiGenerator} from "./HandGenerator";
import {TempaiService} from "./TempaiService";
import {WaitStructure} from "../types/HandStructures";
import {ResultType} from "../types/ResultType";

const DEFAULT_HAND_LENGTH = 7
const HAND_LENGTH_SETTING_NAME = 'HAND_LENGTH'

    declare var window: any

export class StateService {
    private tempaiGenerator = new TempaiGenerator()
    private tempaiService = new TempaiService()
    private _currentScreen: ScreenType = ScreenType.PROCESSING
    private _resultType: ResultType = ResultType.IDLE
    private handLength: number
    private _hand: number[]
    private _waitStructures: WaitStructure[]
    private _selectedTiles: number[] = []
    private _wrong: number[] = []
    private _correct: number[] = []
    private _missed: number[] = []
    private startTime: Date
    private endTime: Date

    onChange: signals.Signal = new signals.Signal()
    onHandChanged: signals.Signal = new signals.Signal()

    private static _instance: StateService
    static get instance(): StateService {
        if (!this._instance) {
            this._instance = new StateService()
        }
        return this._instance
    }

    private constructor() {
        this.handLength = Number(localStorage.getItem(HAND_LENGTH_SETTING_NAME) || DEFAULT_HAND_LENGTH)
        window.tempaiService = this.tempaiService
        this.generateHand()
    }

    get currentScreen(): ScreenType {
        return this._currentScreen
    }

    get hand(): number[] {
        return this._hand
    }

    get structures(): WaitStructure[] {
        return this._waitStructures
    }

    get selectedTiles(): number[] {
        return this._selectedTiles
    }

    get wrongTiles(): number[] {
        return this._wrong
    }

    get correctTiles(): number[] {
        return this._correct
    }

    get missedTiles(): number[] {
        return this._missed
    }

    get resultType(): ResultType {
        return this._resultType
    }

    get timeSpent(): string {
        if (this.resultType === ResultType.IDLE) {
            return ''
        }

        let allSeconds = Math.floor((Number(this.endTime) - Number(this.startTime)) / 1000)
        let min = Math.floor(allSeconds / 60)
        let sec = allSeconds % 60
        let secStr = sec > 9 ? sec.toString() : `0${sec}`
        return `${min} : ${secStr}`
    }

    openAbout() {
        this.setScreen(ScreenType.ABOUT)
    }

    openInfo() {
        this.setScreen(ScreenType.INFO)
    }

    backToGame() {
        this.setScreen(ScreenType.PROCESSING)
    }

    selectLength(value: number) {
        this.handLength = value
        localStorage.setItem(HAND_LENGTH_SETTING_NAME, value.toString())
        this.clear()
        this.setScreen(ScreenType.PROCESSING)
        this.generateHand()
    }

    selectTile(tile: number) {
        let index = this._selectedTiles.indexOf(tile)
        if (index === -1) {
            this._selectedTiles.push(tile)
        } else {
            this._selectedTiles.splice(index, 1)
        }

        this.onChange.dispatch()
    }

    checkWaitings() {
        this.endTime = new Date()
        this._wrong = []
        this._correct = []
        this._missed = []

        let tilesToComplete = this.tempaiService.getTilesToComplete(this._waitStructures)

        console.log(tilesToComplete)

        this.selectedTiles.forEach(tile => {
            if (tilesToComplete.indexOf(tile) !== -1) {
                this._correct.push(tile)
            } else {
                this._wrong.push(tile)
            }
        })

        tilesToComplete.forEach(tile => {
            if (this.selectedTiles.indexOf(tile) === -1) {
                this._missed.push(tile)
            }
        })

        this._resultType = this.calcResult()
        this.onChange.dispatch()
    }

    newGame() {
        this.clear()
        this.onChange.dispatch()
        this.generateHand()
    }

    private setScreen(screen: ScreenType) {
        this._currentScreen = screen
        this.onChange.dispatch()
    }

    private clear() {
        this._hand = []
        this._waitStructures = []
        this._selectedTiles = []
        this._wrong = []
        this._correct = []
        this._missed = []
        this._resultType = ResultType.IDLE
    }

    private generateHand() {
        let {hand, possibleTilesToWait} = this.tempaiGenerator.generate(this.handLength)
        console.log(hand)
        console.log(possibleTilesToWait)

        let waitStructures = this.tempaiService.getWaitStructures(hand, possibleTilesToWait)
        console.log(waitStructures)

        if (waitStructures.length) {
            this._hand = hand
            this._waitStructures = waitStructures
            this.startTime = new Date()
            this.onHandChanged.dispatch()
        } else {
            this.generateHand()
        }
    }

    private calcResult(): ResultType {
        if (this._missed.length === 0 && this._wrong.length === 0) {
            return ResultType.PERFECT
        }

        if (this._correct.length === 0) {
            return ResultType.FAIL
        }

        let result = this._correct.length / (this._wrong.length + this._missed.length + this._correct.length)
        if (result <= 0.5) {
            return ResultType.BAD
        }
        if (result >= 0.8) {
            return ResultType.GOOD
        }

        return ResultType.NOT_REALLY_GOOD
    }
}