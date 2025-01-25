import React from 'react'
import Signup from './components/Signup'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import Login from './components/Login'
import Profile from './components/Profile'
import Home from './components/Home'
import EditProfile from './components/EditProfile'

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home/>
      },
      {
        path: '/profile/:id',
        element: <Profile/>
      },
      {
        path: '/account/edit',
        element: <EditProfile/>
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
])
const App = () => {
  return (
    <div>
      <RouterProvider router = {browserRouter}/>
    </div>
  )
}

export default App
