import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import Game from "../game/game";
import "../index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Debug from "../game/components/debug";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <QueryClientProvider client={queryClient}>
        <div id="app">
          <Game />
          {/* <Debug /> */}
          <Outlet />
        </div>
      </QueryClientProvider>
    </React.Fragment>
  );
}
