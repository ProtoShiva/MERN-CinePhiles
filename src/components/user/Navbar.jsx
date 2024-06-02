import React from "react"
import { IoFlameSharp } from "react-icons/io5"
import { Link, useNavigate } from "react-router-dom"
import { useAuth, useTheme } from "../../hooks"
import Container from "../Container"
import AppSearchForm from "../form/AppSearchForm"
import logo from "../../assets/logo2.png"
export default function Navbar() {
  const { toggleTheme } = useTheme()
  const { authInfo, handleLogout } = useAuth()
  const { isLoggedIn } = authInfo
  const navigate = useNavigate()

  const handleSearchSubmit = (query) => {
    navigate("/movie/search?title=" + query)
  }

  return (
    <div className="bg-secondary shadow-sm shadow-gray-500">
      <Container className="bg-lime-500 py-2">
        <div className="flex justify-between items-center">
          <Link to="/">
            <img src={logo} alt="" className="sm:h-10 h-8" />
          </Link>

          <ul className="flex items-center sm:space-x-4 space-x-2">
            <li>
              {isLoggedIn && (
                <Link
                  to={"/watchlist"}
                  className="text-white font-semibold text-lg cursor-pointer"
                >
                  WatchList
                </Link>
              )}
            </li>
            <li>
              <button
                onClick={toggleTheme}
                className="bg-white dark:bg-dark-subtle p-1 rounded sm:text-2xl text-lg"
              >
                <IoFlameSharp className="text-secondary" size={24} />
              </button>
            </li>
            <li>
              <AppSearchForm
                placeholder="Search"
                inputClassName="border-dark-subtle text-white focus:border-white sm:w-auto w-40 sm:text-lg"
                onSubmit={handleSearchSubmit}
              />
            </li>
            <li>
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="text-white font-semibold text-lg"
                >
                  Log out
                </button>
              ) : (
                <Link
                  className="text-white font-semibold text-lg"
                  to="/auth/signin"
                >
                  Login
                </Link>
              )}
            </li>
          </ul>
        </div>
      </Container>
    </div>
  )
}
