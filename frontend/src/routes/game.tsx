import { createFileRoute } from '@tanstack/react-router'
import { useWebSocket } from '#/hooks/useWebSocket'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/game')({
  component: RouteComponent,
})

const WS_URL = 'ws://localhost:8080'

function RouteComponent() {
  const [color, setColor] = useState<"white" | "black" | null>(null);
  const [status, setStatus] = useState<"idle" | "waiting" | "playing" | "gameover">("idle");
  const [winner, setWinner] = useState<"white" | "black" | null>(null);
  const [fen, setFen] = useState<string | null>(null);

  const { connect, sendMessage } = useWebSocket({
    url: WS_URL,
    onOpen: () => sendMessage({ type: "init_game" }),
    onMessage: (event) => {
      const message = JSON.parse(event.data)
      if (message.type === "waiting_for_opponent") {
        setStatus("waiting");
      }
      if (message.type === "init_game") {
        setColor(message.payload.color);
        setStatus("playing");
      }
      if (message.type === "move") {
        setFen(message.payload.fen);
      }
      if (message.type === "game_over") {
        setWinner(message.payload.winner);
        setStatus("gameover");
      }
    },
  })

  useEffect(() => { connect() }, [])

  return <div>
    {status === "waiting" && <div>Waiting for opponent...</div>}
    {status === "playing" && <div>Playing...</div>}
    {status === "gameover" && <div>Game over...</div>}
    {status === "idle" && <div>Idle...</div>}
  </div>
}
