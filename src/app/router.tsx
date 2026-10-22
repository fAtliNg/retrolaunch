import { createBrowserRouter } from 'react-router-dom'
import Layout from '../components/Layout'
import HomePage from '../pages/HomePage'
import GamePage from '../pages/GamePage'
import NotFoundPage from '../pages/NotFoundPage'

/** Data router нужен для View Transitions и восстановления прокрутки. */
export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'games/:slug', element: <GamePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
