import { createFileRoute } from '@tanstack/react-router'
import Overlay from '../components/overlay'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
  <Overlay className="bg-black/20">
    Test
  </Overlay>
  )
}
