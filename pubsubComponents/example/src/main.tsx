import * as $ from 'subscribers'
import './style.css'
import { App } from './App'

const initState = {
    mama: 'dude',
    fruits: ['🍌', '🍎', '🍉', '🍇']
}

$.init(initState)

document.getElementById('app')?.appendChild(<App fruits="$fruits" />)
