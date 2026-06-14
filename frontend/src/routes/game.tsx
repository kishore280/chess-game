import { createFileRoute } from "@tanstack/react-router";
import { useWebSocket } from "#/hooks/useWebSocket";
import { useEffect, useRef, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess, type Square, type Move } from "chess.js";
import { Moves } from "./-components/Moves";
import { Waiting } from "./-components/Waiting";
import { GameOver } from "./-components/GameOver";

export const Route = createFileRoute("/game")({
  component: RouteComponent,
});

const WS_URL = "ws://localhost:8080";

function RouteComponent() {
  const [color, setColor] = useState<"white" | "black" | null>(null);
  const [status, setStatus] = useState<
    "idle" | "waiting" | "playing" | "gameover"
  >("idle");
  const [winner, setWinner] = useState<"white" | "black" | null>(null);
  const [moves, setMoves] = useState<string[]>([]);
  const [fen, setFen] = useState<string | null>(null);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [validSquares, setValidSquares] = useState<string[]>([]);
  const chessRef = useRef(new Chess());

  const { connect, sendMessage } = useWebSocket({
    url: WS_URL,
    reconnect: false,
    onOpen: () => sendMessage({ type: "init_game" }),
    onMessage: (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "waiting_for_opponent") {
        setStatus("waiting");
      }
      if (message.type === "init_game") {
        setColor(message.payload.color);
        setStatus("playing");
      }
      if (message.type === "move") {
        chessRef.current.load(message.payload.fen);
        setFen(message.payload.fen);
        setMoves(prev => [...prev, message.payload.move.san]);
      }
      if (message.type === "game_over") {
        setWinner(message.payload.winner);
        setStatus("gameover");
      }
    },
  });

  useEffect(() => {
    connect();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {status === "waiting" && <Waiting/>}
      {status === "playing" && (
        <div className="flex gap-24 items-start">
        <div className="w-[480px]">
          <Chessboard
            options={{
              position:
                fen ??
                "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
              boardOrientation: color ?? "white",
              squareStyles: Object.fromEntries(
                validSquares.map((sq) => [
                  sq,
                  { backgroundColor: "rgba(255, 255, 0, 0.25)" },
                ]),
              ),

              onPieceDrag({ square }) {
                const moves = chessRef.current.moves({
                  square: square as Square,
                  verbose: true,
                }) as Move[];
                setValidSquares(moves.map((m) => m.to));
              },

              onPieceDrop({ sourceSquare, targetSquare }) {
                if (!targetSquare) return false;
                sendMessage({
                  type: "move",
                  move: { from: sourceSquare, to: targetSquare },
                });
                setValidSquares([]);

                return true;
              },

              onSquareClick({ square }) {
                if (selectedSquare) {
                  sendMessage({
                    type: "move",
                    move: { from: selectedSquare, to: square },
                  });
                  setSelectedSquare(null);
                  setValidSquares([]);
                } else {
                  const moves = chessRef.current.moves({
                    square: square as Square,
                    verbose: true,
                  }) as Move[];
                  if (moves.length > 0) {
                    setSelectedSquare(square);
                    setValidSquares(moves.map((m) => m.to));
                  }
                }
              },
            }}
          />
        </div>
        <Moves moves ={moves} />
        </div>
      )}
      {status === "gameover" && <GameOver winner={winner}/>}
      {status === "idle" && <div>Idle...</div>}
    </div>
  );
}
