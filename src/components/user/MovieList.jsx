import React, { useEffect, useState } from "react"
import { AiFillStar } from "react-icons/ai"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getPoster } from "../../utils/helper"
import GridContainer from "../GridContainer"
import { BsBookmarkPlus, BsBookmarkPlusFill } from "react-icons/bs"
import {
  saveProductAction,
  unsaveProductAction,
  userDetailsAction
} from "../../redux/slices/users/usersSlices.js"
import { useAuth } from "../../hooks/index.js"
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"

const trimTitle = (text = "") => {
  if (text.length <= 20) return text
  return text.substring(0, 20) + ".."
}

export default function MovieList({ title, movies = [] }) {
  if (!movies.length) return null
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
      slidesToSlide: 4 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
      slidesToSlide: 3 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
      slidesToSlide: 1 // optional, default to 1.
    }
  }

  return (
    <div className=" mb-10">
      {title ? (
        <h1 className="text-[1.2rem] md:text-3xl pl-4  md:p-0 dark:text-white text-secondary font-semibold mb-5">
          {title}
        </h1>
      ) : null}

      <Carousel
        responsive={responsive}
        removeArrowOnDeviceType={["tablet", "mobile"]}
      >
        {movies.map((movie) => {
          return <ListItem key={movie.id} movie={movie} />
        })}
      </Carousel>
    </div>
  )
}

const ListItem = ({ movie }) => {
  const { id, responsivePosters, title, poster, reviews } = movie
  const [showBook, setShowBook] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { authInfo } = useAuth()
  const { isLoggedIn } = authInfo
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
    if (!isLoggedIn) return
    dispatch(saveProductAction(idBack))
    dispatch(userDetailsAction())
    dispatch(userDetailsAction())
  }

  const handleUnbookMovie = async (idBack) => {
    if (!isLoggedIn) return
    dispatch(unsaveProductAction(idBack))
    dispatch(userDetailsAction())
    dispatch(userDetailsAction())
  }

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(userDetailsAction())
    }
  }, [dispatch])

  return (
    <div>
      <div
        className="relative your-class"
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
      >
        <img
          className="aspect-video object-cover w-[18rem] h-[10rem] rounded-lg "
          src={getPoster(responsivePosters) || poster}
          alt={title}
        />
        {showBook && (
          <div className="absolute inset-0 bg-primary bg-opacity-25 backdrop-blur-sm flex justify-center items-center rounded-lg ">
            {savedMovies?.includes(id) && isLoggedIn ? (
              <button
                onClick={() => handleUnbookMovie(id)}
                className="p-2 rounded-full bg-white text-primary hover:opacity-80 transition "
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
        className="text-lg your-class font-semibold cursor-pointer transition duration-300 ease-in-out active:transform active:scale-95 text-secondary dark:text-white hover:text-red-500 dark:hover:text-red-400"
        title={title}
      >
        {trimTitle(title)}
      </h1>
      {reviews?.ratingAvg ? (
        <p className="text-highlight your-class dark:text-highlight-dark flex items-center space-x-1">
          <span>{reviews?.ratingAvg}</span>
          <AiFillStar className="text-yellow-500" />
        </p>
      ) : (
        <p className="text-highlight dark:text-highlight-dark your-class">
          No reviews
        </p>
      )}
    </div>
  )
}
