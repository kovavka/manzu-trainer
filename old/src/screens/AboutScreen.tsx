import * as React from 'react'
import {StateService} from '../services/StateService'

export class AboutScreen extends React.Component {
    stateService: StateService = StateService.instance

    onOkClick() {
        this.stateService.backToGame()
    }

    render() {
     return (
         <div className="about">
             <div className="page-header">
                 <div className="page-header__title">
                     About
                 </div>
             </div>
             <div className="page-content">
                 <div className="about">
                     This project is a mahjong trainer for collecting chinitsu.
                     <br/><br/>
                     Repo: <a href={'https://github.com/kovavka/manzu-trainer'}>GitHub</a><br/>
                     Me:
                     <ul>
                         <li>
                             <a target={'blank'} href={'https://t.me/kovavka'}>t.me/kovavka</a>
                         </li>
                         <li>
                             <a target={'blank'} href={'mailto:kovavka@gmail.com'}>kovavka@gmail.com</a>
                         </li>
                     </ul>
                     <br/>
                     <br/>
                     Please, report bug if you get one.
                 </div>
                 <div className="flex-container flex-container--margin-m">
                     <div className="flat-btn flat-btn--white">
                         <div className="flat-btn__caption" onClick={() => this.onOkClick()}>Back</div>
                     </div>
                 </div>
             </div>
         </div>
     )
    }
}