export function Waiting() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-[#81b64c] border-t-transparent rounded-full animate-spin" />
      <h2 className="text-2xl font-semibold text-gray-700">Waiting for opponent...</h2>
      <p className="text-gray-400">Share the link with a friend to start playing</p>
    </div>
  )
}
