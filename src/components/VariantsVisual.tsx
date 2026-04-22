import * as React from "react";
import {TileVisual} from "./TileVisual";
import {StateService} from '../services/StateService'
import {TileType} from "../types/TileType";

type State = {
    selected: number[]
    wrong: number[]
    correct: number[]
    missed: number[]
}

export class VariantsVisual extends React.Component<unknown, State> {
    stateService: StateService = StateService.instance

    constructor(props: unknown) {
        super(props)

        this.state = {
            selected: this.stateService.selectedTiles,
            wrong: this.stateService.wrongTiles,
            correct: this.stateService.correctTiles,
            missed: this.stateService.missedTiles,
        }
    }

    componentDidMount(): void {
        this.stateService.onChange.add(this.updateState, this)
    }

    componentWillUnmount(): void {
        this.stateService.onChange.add(this.updateState, this)
    }

    updateState() {
        this.setState({
            selected: this.stateService.selectedTiles,
            wrong: this.stateService.wrongTiles,
            correct: this.stateService.correctTiles,
            missed: this.stateService.missedTiles,
        })
    }

    getOptions() {
        const options: React.ReactElement[] = []
        for (let i=1; i<10; i++) {
            options.push(this.getTile(i))
        }

        return options
    }

    getSelectedType(tile: number) {
        if (this.state.wrong.indexOf(tile) !== -1) {
            return TileType.WRONG
        }

        if (this.state.correct.indexOf(tile) !== -1) {
            return TileType.CORRECT
        }

        if (this.state.missed.indexOf(tile) !== -1) {
            return TileType.MISSED
        }

        if (this.state.selected.indexOf(tile) !== -1) {
            return TileType.SELECTED
        }

        return TileType.IDLE
    }

    getTile(tile: number): React.ReactElement {
        return (
            <TileVisual key={tile}
                        tile={tile}
                        selectable={true}
                        selectedType={this.getSelectedType(tile)}
            />
        )
    }

    render() {
        return (
            <div className="hand hand--options">
                {this.getOptions()}
            </div>
        )
    }
}