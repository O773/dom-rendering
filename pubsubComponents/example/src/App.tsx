import * as $ from 'pubsubcomponents'

const centered = (width) => ({
    display: 'grid',
    gridTemplateColumns: '10em 10em',
    gridTemplateRows: '2em 2em',
    width: width + 'em'
})

export const App = ({ fruits }) => {
  const world = '$mama'

  return (
    <div>
      <h1 onclick={() => console.log('hey')}>hello {world}</h1>
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

const FruitList = ({ fruits, numberOfFruits }) => (
    <div style={centered(25)}>
        {fruits.slice(0, numberOfFruits ?? fruits.length).map(fruit => <span>{fruit}</span>)}
    </div>
)