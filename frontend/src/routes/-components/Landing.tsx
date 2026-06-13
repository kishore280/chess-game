import ChessImage from '../../assets/chess_landing.png';

export function Landing() {
  return (
    <div className="min-h-screen flex items-center justify-center px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 w-full max-w-5xl">
        <div className="flex items-center justify-center">
          <img className="w-full max-w-sm rounded-xl" src={ChessImage} />
        </div>
        <div className="flex flex-col justify-center gap-6">
          <div>
            <h1 className="text-5xl font-bold leading-tight text-gray-900">Welcome to Chess</h1>
            <p className="text-gray-500 text-lg mt-2 ml-2">Play chess online with players around the world.</p>
          </div>
          <button className="w-full py-4 bg-[#81b64c] hover:bg-[#6fa03e] text-white text-xl font-bold rounded-lg transition-colors">
            Start Game
          </button>
        </div>
      </div>
    </div>
  )
}
