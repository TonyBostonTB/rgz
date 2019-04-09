import React from 'react'
import { render } from 'react-dom'
import { App } from './app.js'
import './index.css'

const sampleElement = document.getElementById('sample')
render(
  <App sample={sampleElement && sampleElement.innerText} />,
  document.getElementById('app')
)
