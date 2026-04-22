import './App.css'
import {Main} from "./screens/Main.tsx";
import {useEffect} from "react";
import sprite from './assets/sprite.svg?raw'
import {isMobile} from "./services/Ulils.ts";


function App() {
  useEffect(() => {
    let node = document.querySelector('.sprite')!
    node.innerHTML = sprite
    document.body.appendChild(node)

    if (isMobile()) {
      document.querySelector('#root')!.classList.add('mobile')
    }
  }, [])

  return (
    <Main/>
  )
}

export default App
