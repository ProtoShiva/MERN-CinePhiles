import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  saveProductAction,
  unsaveProductAction,
  userDetailsAction
} from "../../redux/slices/users/usersSlices.js"
import { useAuth, useNotification } from "../../hooks/index.js"
import { getAllMovies } from "../../api/movie.js"
import { getPoster } from "../../utils/helper.jsx"
import { BsBookmarkPlus, BsBookmarkPlusFill } from "react-icons/bs"
import Container from "../Container.jsx"

const trimTitle = (text = "") => {
  if (text.length <= 20) return text
  return text.substring(0, 20) + ".."
}

const WatchList = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showBook, setShowBook] = useState(null)
  const { authInfo } = useAuth()
  const profileName = authInfo?.profile?.name
  const firstName = profileName?.split(" ")[0]

  const { updateNotification } = useNotification()
  const { user, userDetails } = useSelector((state) => state?.users)

  const gotUser = userDetails

  const savedMovies = gotUser?.saved

  const savedMovies2 = gotUser?.saved?.map((product) => {
    return product._id
  })

  const handleOnMouseEnter = (movieId) => {
    setShowBook(movieId)
  }

  const handleOnMouseLeave = () => {
    setShowBook(null)
  }

  const handleBookMovies = async (idBack) => {
    dispatch(saveProductAction(idBack))
    dispatch(userDetailsAction())
    dispatch(userDetailsAction())
  }

  const handleUnbookMovie = async (idBack) => {
    dispatch(unsaveProductAction(idBack))
    dispatch(userDetailsAction())
    dispatch(userDetailsAction())
  }

  useEffect(() => {
    dispatch(userDetailsAction())
  }, [dispatch])

  return (
    <div className="dark:bg-primary bg-white h-screen py-3">
      <Container>
        <h1 className="mb-10 text-4xl dark:text-white text-highlight font-semibold text-center">
          {" "}
          {firstName}'s Watchlist
        </h1>
        <div className="grid lg:grid-cols-5 md:grid-cols-2 grid-cols-2 gap-8 px-5">
          {savedMovies?.map((mov) => (
            <div key={mov._id}>
              <div
                className="relative"
                onMouseEnter={() => handleOnMouseEnter(mov._id)}
                onMouseLeave={handleOnMouseLeave}
              >
                <img
                  className="aspect-video object-cover w-full rounded-lg"
                  src={mov.poster.url}
                  alt={mov.title}
                />
                {showBook === mov._id && (
                  <div className="absolute inset-0 bg-primary bg-opacity-25 backdrop-blur-sm flex justify-center items-center rounded-lg z-auto">
                    {savedMovies2?.includes(mov._id) ? (
                      <button
                        onClick={() => handleUnbookMovie(mov._id)}
                        className="p-2 rounded-full bg-white text-primary hover:opacity-80 transition"
                      >
                        <BsBookmarkPlusFill />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBookMovies(mov._id)}
                        className="p-2 rounded-full bg-white text-primary hover:opacity-80 transition"
                      >
                        <BsBookmarkPlus />
                      </button>
                    )}
                  </div>
                )}
              </div>

              <h1
                onClick={() => {
                  navigate("/movie/" + mov._id)
                }}
                className="text-lg dark:text-white text-secondary font-semibold cursor-pointer  hover:text-red-500 dark:hover:text-red-400 active:transform active:scale-95 transition duration-300 ease-in-out"
                title={mov.title}
              >
                {trimTitle(mov.title)}
              </h1>
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}

export default WatchList
