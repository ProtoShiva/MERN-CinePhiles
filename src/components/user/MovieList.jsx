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
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

const trimTitle = (text = "") => {
  if (text.length <= 20) return text
  return text.substring(0, 20) + ".."
}

export default function MovieList({ title, movies = [] }) {
  if (!movies.length) return null

  function SampleNextArrow(props) {
    const { className, style, onClick } = props
    return (
      <div
        className={`${className} bg-gray-500 rounded-full dark:bg-black hover:bg-primary`} // Tailwind CSS classes for color
        style={{ ...style, display: "block" }}
        onClick={onClick}
      />
    )
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props
    return (
      <div
        className={`${className} bg-gray-500 rounded-full dark:bg-black hover:bg-primary`} // Tailwind CSS classes for color
        style={{ ...style, display: "block" }}
        onClick={onClick}
      />
    )
  }

  let settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    initialSlide: 0,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  }
  return (
    <div className=" mb-10">
      {title ? (
        <h1 className="text-2xl dark:text-white text-secondary font-semibold mb-5">
          {title}
        </h1>
      ) : null}

      <Slider {...settings}>
        {movies.map((movie) => {
          return <ListItem key={movie.id} movie={movie} />
        })}
      </Slider>
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
    if (isLoggedIn) {
      dispatch(userDetailsAction())
    }
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
            {savedMovies?.includes(id) && isLoggedIn ? (
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
        className="text-lg font-semibold cursor-pointer transition duration-300 ease-in-out active:transform active:scale-95 text-secondary dark:text-white hover:text-red-500 dark:hover:text-red-400"
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
