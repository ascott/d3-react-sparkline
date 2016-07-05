import React from 'react'
import ReactDOM from 'react-dom'
import Histogram from './Histogram.js'

ReactDOM.render(
  <Histogram width={window.innerWidth} height={window.innerHeight} />,
  document.getElementById('mount')
)
