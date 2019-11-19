import * as React from "react";
import {TileService} from "../services/TileService";
import './tile.less';
import {StateService} from '../services/StateService'

type TileVisualProps = {
    tile: number,
    selectable: boolean,
    selected: boolean,
}

type TileVisualState = {
    isDropped: boolean
}

export class TileVisual extends React.Component<TileVisualProps, TileVisualState> {
    stateService: StateService = StateService.instance

    constructor(props: TileVisualProps) {
        super(props);
        this.state = {
            isDropped: false,
        }
    }

    onTileSelected() {
        if (this.props.selectable) {
            this.stateService.selectTile(this.props.tile)
        }
    }

    render() {
     return (
         <div className={`tile`}
              onClick={() => this.onTileSelected()}>
             <div className={'tile__inner'}>
                 <svg viewBox={'0 0 300 470'} className='tile__box'>
                    <use xlinkHref='#tile-hand'></use>
                 </svg>

                 <svg viewBox={'0 0 300 400'}
                     className={'tile__drawing tile__drawing--hand'}>
                     <use xlinkHref={`#${TileService.getSvg(this.props.tile)}`}></use>
                 </svg>
             </div>
         </div>
     )
    }
}