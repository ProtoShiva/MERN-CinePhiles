import React, { useEffect, useRef, useState, forwardRef } from "react"
import { MdOutlineNavigateNext, MdNavigateBefore } from "react-icons/md"
import { Link } from "react-router-dom"
import { getLatestUploads } from "../../api/movie"
import { useNotification } from "../../hooks"

let count = 0
let intervalId

export default function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState({})
  const [clonedSlide, setClonedSlide] = useState({})
  const [slides, setSlides] = useState([])
  const [visible, setVisible] = useState(true)
  const slideRef = useRef()
  const clonedSlideRef = useRef()

  const { updateNotification } = useNotification()

  const fetchLatestUploads = async () => {
    const { error, movies } = await getLatestUploads()
    if (error) return updateNotification("error", error)
    setSlides([...movies])
    setCurrentSlide(movies[0])
  }

  const startSlideShow = () => {
    intervalId = setInterval(handleOnNextClick, 3500)
  }

  const pauseSlideShow = () => {
    clearInterval(intervalId)
  }

  const handleVisibilityChange = () => {
    const visibility = document.visibilityState
    if (visibility === "hidden") setVisible(false)
    if (visibility === "visible") setVisible(true)
  }
  const handleOnNextClick = () => {
    pauseSlideShow()
    setClonedSlide(slides[count])
    count = (count + 1) % slides.length
    setCurrentSlide(slides[count])

    clonedSlideRef.current.classList.remove("hidden")
    clonedSlideRef.current.classList.add("slide-out-to-left")
    slideRef.current.classList.add("slide-in-from-right")
  }

  const handleOnPrevClick = () => {
    pauseSlideShow()
    setClonedSlide(slides[count])
    count = (count + slides.length - 1) % slides.length
    setCurrentSlide(slides[count])

    clonedSlideRef.current.classList.remove("hidden")
    clonedSlideRef.current.classList.add("slide-out-to-right")
    slideRef.current.classList.add("slide-in-from-left")
  }

  const handleAnimationEnd = () => {
    const classes = [
      "slide-out-to-left",
      "slide-in-from-right",
      "slide-out-to-right",
      "slide-in-from-left"
    ]
    clonedSlideRef.current.classList.remove(...classes)
    clonedSlideRef.current.classList.add("hidden")
    slideRef.current.classList.remove(...classes)
    startSlideShow()
  }

  useEffect(() => {
    fetchLatestUploads()
    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      pauseSlideShow()
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  // useEffect(() => {
  //   if (slides.length && visible) {
  //     startSlideShow()
  //   } else pauseSlideShow()
  // }, [slides.length, visible])

  return (
    <div className="w-full flex">
      {/* Slide show section */}
      <div className="w-full aspect-video  relative overflow-hidden">
        {/* current slide */}
        <Slide
          ref={slideRef}
          title={currentSlide.title}
          src={currentSlide.poster}
          id={currentSlide.id}
        />

        {/* cloned slide */}
        <Slide
          ref={clonedSlideRef}
          onAnimationEnd={handleAnimationEnd}
          className="absolute inset-0"
          src={clonedSlide.poster}
          title={clonedSlide.title}
          id={currentSlide.id}
        />

        <SlideShowController
          onNextClick={handleOnNextClick}
          onPrevClick={handleOnPrevClick}
        />
      </div>
    </div>
  )
}

const SlideShowController = ({ onNextClick, onPrevClick }) => {
  const btnClass =
    "text-white text-8xl p-2 outline-none opacity-50 hover:opacity-100 transition duration-500 ease-in-out"
  return (
    <div className="absolute top-1/2 -translate-y-1/2 w-full flex items-center justify-between px-2">
      <button onClick={onPrevClick} className={btnClass} type="button">
        <MdNavigateBefore />
      </button>
      <button onClick={onNextClick} className={btnClass} type="button">
        <MdOutlineNavigateNext />
      </button>
    </div>
  )
}

const Slide = forwardRef((props, ref) => {
  const { title, id, src, className = "", ...rest } = props
  return (
    <Link
      to={"/movie/" + id}
      ref={ref}
      className={"w-full cursor-pointer block " + className}
      {...rest}
    >
      {src ? (
        <img className="w-full h-full object-cover" src={src} alt="" />
      ) : null}
      {title ? (
        <div className="absolute inset-0 flex flex-col justify-end py-3 bg-gradient-to-t from-primary via-transparent">
          <h1 className="font-semibold text-4xl text-highlight-dark mb-44">
            {title}
          </h1>
        </div>
      ) : null}
    </Link>
  )
})
