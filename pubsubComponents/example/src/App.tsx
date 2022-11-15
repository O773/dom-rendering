import * as pubsubcomponents from 'pubsubcomponents'

export const App = (props) => {
  console.log(props)
  return (
    <div>
      <h1 onclick={() => console.log('hey')}>hello world!</h1>
      { ['🍌', '🍎', '🍉' ].map(fruitemoji => <span>{fruitemoji}</span>) }
    </div>
  )
}