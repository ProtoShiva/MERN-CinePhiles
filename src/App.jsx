import React from "react"
import { Routes, Route } from "react-router-dom"
import Signin from "./components/auth/Signin.jsx"
import Signup from "./components/auth/Signup.jsx"
import Home from "./components/Home.jsx"
import Navbar from "./components/user/Navbar.jsx"
import NotFound from "./components/NotFound.jsx"
import { useAuth } from "./hooks/index.js"
import AdminNavigator from "./navigator/AdminNavigator.jsx"
import SingleMovie from "./components/user/SingleMovie.jsx"
import MovieReviews from "./components/user/MovieReviews.jsx"
import SearchMovies from "./components/user/SearchMovies.jsx"
import WatchList from "./components/user/WatchList.jsx"
import PrivateRoute from "./utils/PrivateRoute.jsx"

export default function App() {
  const { authInfo } = useAuth()
  const isAdmin = authInfo.profile?.role === "admin"

  if (isAdmin) return <AdminNavigator />

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/signin" element={<Signin />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/movie/:movieId" element={<SingleMovie />} />
        <Route path="/movie/reviews/:movieId" element={<MovieReviews />} />
        <Route path="/movie/search" element={<SearchMovies />} />
        <Route
          path="/watchlist"
          element={<PrivateRoute element={WatchList} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
