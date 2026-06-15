import { useNavigate, Link } from '@tanstack/react-router';
import { Route } from '../__root';
import ChessImage from '../../assets/chess_landing.png';

export function Landing() {
  const navigate = useNavigate()
  const { user } = Route.useRouteContext()

  async function handleLogout() {
    await fetch('http://localhost:3001/auth/logout', { method: 'POST', credentials: 'include' })
    navigate({ to: '/login' })
  }

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
          {user ? (
            <div className="flex flex-col gap-3">
              <p className="text-gray-700 font-medium">Logged in as <span className="font-bold">{user.username}</span></p>
              <button
                className="w-full py-4 bg-[#81b64c] hover:bg-[#6fa03e] text-white text-xl font-bold rounded-lg transition-colors"
                onClick={() => navigate({ to: '/game' })}
              >
                Start Game
              </button>
              <button
                className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm underline"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link to="/login">
                <button className="w-full py-4 bg-[#81b64c] hover:bg-[#6fa03e] text-white text-xl font-bold rounded-lg transition-colors">
                  Login
                </button>
              </Link>
              <Link to="/register" className="text-center text-sm text-gray-500 underline">
                Create account
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
