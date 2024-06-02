import React, { useEffect, useState } from "react"
import { AiFillStar } from "react-icons/ai"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getPoster } from "../../utils/helper"
import GridContainer from "../GridContainer"
import { BsBookmarkPlus, BsBookmarkPlusFill } from "react-icons/bs"

import { useAuth, useMovies } from "../../hooks"
import {
  saveProductAction,
  unsaveProductAction,
  userDetailsAction
} from "../../redux/slices/users/usersSlices.js"

const trimTitle = (text = "") => {
  if (text.length <= 20) return text
  return text.substring(0, 20) + ".."
}

export default function MovieList({ title, movies = [] }) {
  if (!movies.length) return null

  return (
    <div className=" mb-10">
      {title ? (
        <h1 className="text-2xl dark:text-white text-secondary font-semibold mb-5">
          {title}
        </h1>
      ) : null}
      <GridContainer>
        {movies.map((movie) => {
          return <ListItem key={movie.id} movie={movie} />
        })}
      </GridContainer>
    </div>
  )
}

const ListItem = ({ movie }) => {
  const { id, responsivePosters, title, poster, reviews } = movie
  const [showBook, setShowBook] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, userDetails } = useSelector((state) => state?.users)

  const gotUser = userDetails

  const savedMovies = gotUser?.saved?.map((product) => {
    return product._id
  })

  const handleOnMouseEnter = () => {
    setShowBook(true)
  }

  const handleOnMouseLeave = () => {
    setShowBook(false)
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
    <div>
      <div
        className="relative"
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
      >
        <img
          className="aspect-video object-cover w-full rounded-lg"
          src={getPoster(responsivePosters) || poster}
          alt={title}
        />
        {showBook && (
          <div className="absolute inset-0 bg-primary bg-opacity-25 backdrop-blur-sm flex justify-center items-center rounded-lg z-auto">
            {savedMovies?.includes(id) ? (
              <button
                onClick={() => handleUnbookMovie(id)}
                className="p-2 rounded-full bg-white text-primary hover:opacity-80 transition"
              >
                <BsBookmarkPlusFill />
              </button>
            ) : (
              <button
                onClick={() => handleBookMovies(id)}
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
          navigate("/movie/" + id)
        }}
        className="text-lg dark:text-white text-secondary font-semibold cursor-pointer  hover:text-red-500 active:transform active:scale-95 transition duration-300 ease-in-out"
        title={title}
      >
        {trimTitle(title)}
      </h1>
      {reviews?.ratingAvg ? (
        <p className="text-highlight dark:text-highlight-dark flex items-center space-x-1">
          <span>{reviews?.ratingAvg}</span>
          <AiFillStar className="text-yellow-500" />
        </p>
      ) : (
        <p className="text-highlight dark:text-highlight-dark">No reviews</p>
      )}
    </div>
  )
}
