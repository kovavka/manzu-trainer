import React from 'react'
import './App.less'
import {Main} from './screens/Main'
import {isMobile} from './services/Ulils'
import {loadSpriteAsync} from './services/SpriteLoader'

const App: React.FC = () => {
    loadSpriteAsync()

    if (isMobile()) {
        document.querySelector('#root')!.classList.add('mobile')
    }

   return (
        <Main/>
  );
}

export default App;
