export function GameOver({ winner }: { winner: "white" | "black" | null }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-4xl font-bold">{winner ? `${winner} wins!` : "Game Over"}</h1>
      <button
        className="px-6 py-3 bg-[#81b64c] hover:bg-[#6fa03e] text-white text-lg font-bold rounded-lg transition-colors"
        onClick={() => window.location.reload()}
      >
        Play Again
      </button>
    </div>
  )
}
