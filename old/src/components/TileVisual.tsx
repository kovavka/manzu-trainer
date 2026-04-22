import * as React from "react";
import {TileService} from "../services/TileService";
import './tile.less';
import {StateService} from '../services/StateService'
import {TileType} from "../types/TileType";

type TileVisualProps = {
    tile: number,
    selectable: boolean,
    selectedType: TileType,
}

export class TileVisual extends React.Component<TileVisualProps> {
    stateService: StateService = StateService.instance

    constructor(props: TileVisualProps) {
        super(props);
    }

    onTileSelected() {
        if (this.props.selectable) {
            this.stateService.selectTile(this.props.tile)
        }
    }

    getTileClassName() {
        let className = 'tile'

        if (this.props.selectable) {
            className += ' tile--selectable'
        }

        switch (this.props.selectedType) {
            case TileType.SELECTED:
                className += ' tile--selected'
                break
            case TileType.CORRECT:
                className += ' tile--correct'
                break
            case TileType.WRONG:
                className += ' tile--wrong'
                break
            case TileType.MISSED:
                className += ' tile--missed'
                break
        }

        return className
    }

    render() {
     return (
         <div className={this.getTileClassName()}
              onClick={() => this.onTileSelected()}>
             <div className={'tile__inner'}>
                 {!this.props.selectable && (
                     <svg viewBox={'0 0 300 470'} className='tile__box'>
                         <use xlinkHref='#tile-hand'></use>
                     </svg>
                 )}
                 {this.props.selectable && (
                     <svg viewBox={'0 0 300 440'} className='tile__box'>
                         <use xlinkHref='#tile-option'></use>
                     </svg>
                 )}

                 <svg viewBox={'0 0 300 400'}
                     className={'tile__drawing tile__drawing--hand'}>
                     <use xlinkHref={`#${TileService.getSvg(this.props.tile)}`}></use>
                 </svg>
             </div>
         </div>
     )
    }
}