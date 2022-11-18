import * as $ from 'subscribers'

const centered = (margin) => ({
    margin: margin+'px',
    height: '100px'
})

const delay = (ms: number, value: any) => new Promise(r => setTimeout(() => r(value), ms))

export const App = ({ fruits }) => {
  const world = '$mama'

  return (
    <div>
      <h1 onclick={() => console.log('hey')}>hello {world}</h1>
      <SlowImage url="$imageUrl" />
      <FruitList fruits={fruits} numberOfFruits='$fruitsToShow' />
      <div style={centered(25)}>
          <input onInput={e => $.set('mama', e.target.value)} />
          <input type="range" defaultvalue="0" min="0" max={fruits.length} onInput={e => {
              $.set('fruitsToShow', Number(e.target.value))
          }} />
      </div>
    </div>
  )
}

const FruitList = ({ fruits, numberOfFruits }) => <div style={centered(25)}>{fruits.slice(0, numberOfFruits ?? fruits.length).map(fruit => <span>{fruit}</span>)}</div>

const SlowImage = ({ url }) => {
    if (!url) {
        $.set('$imageUrl', delay(2000, 'http://www.impawards.com/2009/posters/moon_ver2_xlg.jpg'))
        return <div>'loading...'</div>
    }

    return <div><img src={url} alt="poster for moon (2009)"/></div>
}
