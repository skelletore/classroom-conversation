import React from 'react'
import { createGlobalStyle } from 'styled-components'

import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'

import Landingpage from './Landingpage/Landingpage'
import ConversationComponent from './Conversation/Conversation'
import Start from './Start/Start'

import Browse from './Browse/Browse'
import Credits from './Credits/Credits'
import NotFound from './Notfound/Notfound'

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    font-family: "Open Sans", sans-serif;
  }
  html {
    height: 100%;
    width: 100%;
    position: fixed;
  }

  body {
    font-size: 1rem;
  }
  
  h1 {
    font-family: "Gloria Hallelujah", cursive;
    font-size: 2.5rem;
  }


  button, a {
    outline: none;
    box-shadow: none;
    border-radius: 8px;
    border: 1px solid black;
    padding: 1rem;
    font-size: 1rem;
    cursor: pointer;
  }

  .btn-dark {
    background-color: #363334;
    color: #FFFFFF;
    border: none;
  }
`

function App() {
  return (
    <Router>
      <GlobalStyle />
      <Switch>
        <Route exact path="/" component={Landingpage} />
        <Route exact path="/browse" component={Browse} />
        <Route exact path="/credits" component={Credits} />

        <Route exact path="/conversation/:uuid/start" component={Start} />
        <Route
          exact
          path="/conversation/:uuid/:id"
          component={ConversationComponent}
        />
        <Route
          path="*"
          component={NotFound} />
      </Switch>
    </Router>
  )
}

export default App
