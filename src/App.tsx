import './App.css'
import {Main} from "./screens/Main.tsx";
import {useEffect} from "react";
import {isMobile} from "./services/Ulils.ts";

function App() {
  useEffect(() => {
    if (isMobile()) {
      document.querySelector('#root')!.classList.add('mobile')
    }
  }, [])

  return (
    <Main/>
  )
}

export default App
