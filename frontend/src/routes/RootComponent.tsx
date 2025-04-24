import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/RootComponent')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/RootComponent"!</div>
}
