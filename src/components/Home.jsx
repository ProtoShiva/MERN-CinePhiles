import React from "react"
import Container from "./Container"
import HeroSlideshow from "./user/HeroSlideshow"
import NotVerified from "./user/NotVerified"
import TopRatedMovies from "./user/TopRatedMovies"
import TopRatedTVSeries from "./user/TopRatedTVSeries"
import TopRatedWebSeries from "./user/TopRatedWebSeries"

export default function Home() {
  return (
    <div className="dark:bg-primary bg-white">
      <div className="bg-primary  min-h-screen">
        <HeroSlideshow />
      </div>
      <Container className="px-2 xl:p-0">
        <NotVerified />
        {/* slider */}

        {/* Most rated movies */}
        <div className="space-y-3 py-8 dark:bg-primary bg-white ">
          <TopRatedMovies />
          <TopRatedWebSeries />
          <TopRatedTVSeries />
        </div>
      </Container>
    </div>
  )
}
