import * as React from "react";
import {TileVisual} from "./TileVisual";
import {StateService} from '../services/StateService'
import {TileType} from "../types/TileType";
import {WaitPattern, WaitStructure} from "../types/HandStructures";

type HandState = {
    structures: WaitStructure[]
}

export class InfoVisual extends React.Component<{}, HandState> {
    stateService: StateService = StateService.instance

    constructor(props) {
        super(props)

        this.state = {
            structures: this.stateService.structures,
        }
    }

    componentDidMount(): void {
        this.stateService.onHandChanged.add(this.updateState, this)
    }

    componentWillUnmount(): void {
        this.stateService.onHandChanged.remove(this.updateState, this)
    }

    updateState() {
        this.setState({
            structures: this.stateService.structures,
        })
    }

    getTile(tile: number, index: number) {
        return (
            <TileVisual key={index}
                        tile={tile}
                        selectable={false}
                        selectedType={TileType.IDLE}
            />
        )
    }

    getStructure(structure: WaitStructure, index: number) {
        return (
            <div className="hand-info__structure"
                 key={index}>
                <div className="flex-container flex-container--margin-s">
                    {structure.sets.map(this.getSet.bind(this))}

                    {structure.pair && (
                        <div className="hand hand--separated">
                            {this.getTile(structure.pair, 0)}
                            {this.getTile(structure.pair, 1)}
                        </div>
                    )}

                    {structure.waitPatterns.map(this.getWaitTiles.bind(this))}
                </div>
                <div className="flex-container flex-container--margin-s">
                    <div className="hand-info__text">tiles to complete</div>
                    {structure.waitPatterns.map(this.getCompleteTiles.bind(this))}
                </div>
            </div>
        )
    }

    getSet(tiles: number[], index: number) {
        return (
            <div className="hand hand--separated"
                 key={index}>
                {tiles.map(this.getTile.bind(this))}
            </div>
        )
    }

    getWaitTiles(waitPattern: WaitPattern, index: number) {
        return (
            <div className="hand hand--separated"
                 key={index}>
                {waitPattern.tiles.map(this.getTile.bind(this))}
            </div>
        )
    }

    getCompleteTiles(waitPattern: WaitPattern, index: number) {
        return (
            <div className="hand"
                 key={index}>
                {waitPattern.tilesToComplete.map(this.getTile.bind(this))}
            </div>
        )
    }

    render() {
        return (
            <div className="hand-info">
                {this.state.structures.map(this.getStructure.bind(this))}
            </div>
        )
    }
}