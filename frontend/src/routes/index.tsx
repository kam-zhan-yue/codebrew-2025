import { createFileRoute } from '@tanstack/react-router'
import { useHelloWorld } from '../api/hooks/use-hello-world'
import Overlay from '../components/overlay';

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isPending, isError, data, error } = useHelloWorld();

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const helloWorldData = data.data
  return <Overlay>{helloWorldData}</Overlay>
}
