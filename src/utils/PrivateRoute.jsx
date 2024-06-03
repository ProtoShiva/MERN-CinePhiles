import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks"

const PrivateRoute = ({ element: Component, ...rest }) => {
  const { authInfo } = useAuth()
  const isLoggedIn = !!authInfo?.profile

  return isLoggedIn ? <Component {...rest} /> : <Navigate to="/" />
}

export default PrivateRoute
