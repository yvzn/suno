import { Router } from 'preact-router'

import { Home } from './pages/Home'
import { Journey } from './pages/Journey'
import { Sun } from './pages/Sun'
import { Directions } from './pages/Directions'
import { NotFound } from './pages/NotFound'

export function App() {
  return (
    <Router>
      <Home path="/" />
      <Journey path="/journey" />
      <Sun path="/sun" />
      <Directions path="/directions" />
      <NotFound default />
    </Router>
  )
}
