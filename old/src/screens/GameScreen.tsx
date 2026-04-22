import * as React from 'react'
import {StateService} from '../services/StateService'
import {HandVisual} from '../components/HandVisual'
import {VariantsVisual} from '../components/VariantsVisual'
import {ResultType} from "../types/ResultType";
import {MetricService} from "../services/MetriсService";

type State = {
    resultType: ResultType
    timeSpent: string
}

export class GameScreen extends React.Component<{}, State> {
    stateService: StateService = StateService.instance

    constructor(props) {
        super(props)

        this.state = {
            resultType: this.stateService.resultType,
            timeSpent: this.stateService.timeSpent,
        }
    }

    componentDidMount(): void {
        this.stateService.onChange.add(this.updateState, this)
    }

    componentWillUnmount(): void {
        this.stateService.onChange.remove(this.updateState, this)
    }

    updateState() {
        this.setState({
            resultType: this.stateService.resultType,
            timeSpent: this.stateService.timeSpent,
        })
    }

    onAboutClick() {
        this.stateService.openAbout()
    }

    onInfoClick() {
        if (this.state.resultType !== ResultType.IDLE) {
            this.stateService.openInfo()
        }
    }

    onConfirmClick() {
        this.stateService.checkWaitings()
    }

    onNewGameClick() {
        MetricService.newGame()
        this.stateService.newGame()
    }

    onLengthSelected(value: number) {
        MetricService.selectLength(value)
        this.stateService.selectLength(value)
    }

    get titleClassName() {
        if (this.state.resultType === ResultType.IDLE) {
            return "page-header__title"
        }
        if (this.state.resultType === ResultType.NOT_REALLY_GOOD) {
            return "pointer page-header__title pointer"
        }
        if (this.state.resultType === ResultType.FAIL || this.state.resultType === ResultType.BAD) {
            return "pointer page-header__title page-header__title--fail pointer"
        }
        if (this.state.resultType === ResultType.GOOD || this.state.resultType === ResultType.PERFECT) {
            return "pointer page-header__title page-header__title--success pointer"
        }
    }

    render() {
     return (
         <div className="screen">
             <div className="page-header">
                 <div className="flex-container flex-container--between">
                     <div className="flex-container flex-container--small">
                         <div className="pointer" onClick={() => this.onLengthSelected(7)}>7</div>
                         <div className="separator" />
                         <div className="pointer" onClick={() => this.onLengthSelected(10)}>10</div>
                         <div className="separator" />
                         <div className="pointer" onClick={() => this.onLengthSelected(13)}>13</div>
                     </div>

                     <div>
                         {this.state.timeSpent}
                     </div>
                     <div className="flex-container flex-container--small flex-container--end">
                        <div className="page-footer__title" onClick={() => this.onAboutClick()}>About</div>
                     </div>
                 </div>
                 <div className={"flex-container flex-container--margin-l flex-container--center " + this.titleClassName}
                    onClick={() => this.onInfoClick()}>
                     {this.state.resultType === ResultType.IDLE && (
                         <div>Select waits</div>
                     )}
                     {this.state.resultType === ResultType.FAIL && (
                         <div>Fail</div>
                     )}
                     {this.state.resultType === ResultType.BAD && (
                         <div>Bad</div>
                     )}
                     {this.state.resultType === ResultType.NOT_REALLY_GOOD && (
                         <div>Not really good</div>
                     )}
                     {this.state.resultType === ResultType.GOOD && (
                         <div>Good</div>
                     )}
                     {this.state.resultType === ResultType.PERFECT && (
                         <div>Perfect</div>
                     )}

                     {this.state.resultType !== ResultType.IDLE && (
                         <svg viewBox={'0 0 28 28'} className="info-icon">
                             <use xlinkHref='#info'></use>
                         </svg>
                     )}
                 </div>
             </div>

             <div className="page-content flex-container flex-container--column">
                 <div className="page-content__inner">
                     <HandVisual/>

                     <div className="flex-container flex-container--between flex-container--align-end flex-container--margin-m">
                        <VariantsVisual/>
                         {this.state.resultType === ResultType.IDLE && (
                             <div className="flat-btn flat-btn--s flat-btn--white">
                                 <div className="flat-btn__caption" onClick={() => this.onConfirmClick()}>Confirm</div>
                             </div>
                         )}
                         {this.state.resultType !== ResultType.IDLE && (
                             <div className="flat-btn flat-btn--s flat-btn--white">
                                 <div className="flat-btn__caption" onClick={() => this.onNewGameClick()}>New game</div>
                             </div>
                         )}
                     </div>
                 </div>
             </div>
         </div>
     )
    }
}