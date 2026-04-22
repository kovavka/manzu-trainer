import * as React from "react";
import {TileVisual} from "./TileVisual";
import {StateService} from '../services/StateService'
import {TileType} from "../types/TileType";

type HandState = {
    tiles: number[]
}

export class HandVisual extends React.Component<{}, HandState> {
    stateService: StateService = StateService.instance

    constructor(props) {
        super(props)

        this.state = {
            tiles: this.stateService.hand,
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
            tiles: this.stateService.hand,
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

    render() {
        return (
            <div className="hand hand--all">
                {this.state.tiles.map(this.getTile.bind(this))}
            </div>
        )
    }
}