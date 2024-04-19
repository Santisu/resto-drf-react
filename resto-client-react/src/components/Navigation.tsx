import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

// export default function Navigation() {
//   let { user, logout } = useAuth()

//   let logoutUser = (e: React.MouseEvent ) => {
//       e.preventDefault()
//       logout()
//   }

//   return (
//     <div>
//         <Link to="/">Home</Link>
//         <span> | </span>
//         {user ? (
//             <Link to="/" onClick={logoutUser}>Logout</Link>
//         ) : (<>
//             <Link to="/login" >Login</Link>
//             <span> | </span>
//             <Link to="/register">Register</Link>
//             </>
//         )}
//         {user && <p>Hello {user.email}!</p>}

//     </div>
// )
// }

export default function Navigation() {
  let { user, logout } = useAuth();

  return (
    <div className="flex justify-between fixed top-0 left-0 w-full z-50 p-8 text-xl font-bold bg-reddy-cream">
      <div className="flex gap-3">
        <Link to="/">
          <div className="p-3 rounded bg-reddy-green text-reddy-white hover:bg-reddy-green-200">
            Inicio
          </div>
        </Link>
        {user ? (
          <>
            <Link to="/platos">
              <div className="p-3 rounded bg-reddy-green text-reddy-white hover:bg-reddy-green-200">
                Platos
              </div>
            </Link>
          </>
        ) : (
          <></>
        )}
      </div>
      <div className="flex gap-3">
        {user ? (
          <>
            <Link to={"/login"} onClick={logout}>
              <div className="p-3 rounded bg-reddy-green text-reddy-white hover:bg-reddy-green-200">
                Logout
              </div>
            </Link>
          </>
        ) : (
          <>
            <Link to="/login">
              <div className="p-3 rounded bg-reddy-green text-reddy-white hover:bg-reddy-green-200">
                Login
              </div>
            </Link>
            <Link to="">
              <div className="p-3 rounded bg-reddy-green text-reddy-white hover:bg-reddy-green-200">
                Register
              </div>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
