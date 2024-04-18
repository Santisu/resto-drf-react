import { restrictedView } from "../api/authService";
import { useAuth } from "../context/useAuth";

export default function HomePage() {
  const { user } = useAuth();


  const handleClick = async() => {
     try {
      await restrictedView()
     } catch (error) {
      
     }
  }

  return (
      <>
      {user ? (
      <div>
          <p>You are logged in to the homepage!</p>
      </div>
      ):(
      <div>
          <p>You are not logged in</p>
      </div>
      )}
      <button onClick={handleClick}>Restricted</button>
      <input type="Bart" />
      </>
  )
}