import { createFileRoute } from "@tanstack/react-router";
import { useHelloWorld } from "../api/hooks/use-hello-world";
import Overlay from "../components/overlay";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isPending, isError, data } = useHelloWorld();

  if (isPending) {
    return <></>;
  }

  if (isError) {
    return <></>;
  }

  const helloWorldData = data.data;
  return <Overlay>{helloWorldData}</Overlay>;
}
