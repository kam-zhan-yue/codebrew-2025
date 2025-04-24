import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import Game from '../game/game'
import '../index.css'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <React.Fragment>
      <div id="app">
        <Game />
        <Outlet />
      </div>
    </React.Fragment>
  )
}
