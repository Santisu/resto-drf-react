import { Link } from "react-router-dom";
import {useAuth} from "../context/useAuth";



export default function Navigation() {
  let { user, logout } = useAuth()
  
  let logoutUser = (e: React.MouseEvent ) => {
      e.preventDefault()
      logout()
  }

  return (
    <div>
        <Link to="/">Home</Link>
        <span> | </span>
        {user ? (
            <Link to="/" onClick={logoutUser}>Logout</Link>
        ) : (<>
            <Link to="/login" >Login</Link>
            <span> | </span>
            <Link to="/register">Register</Link>
            </>
        )}
        {user && <p>Hello {user.email}!</p>}

    </div>
)
}
