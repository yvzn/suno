import { render } from 'preact'
import { App } from './app'
import './styles/tokens.css'

const root = document.getElementById('app')
root.innerHTML = ''
render(<App />, root)
