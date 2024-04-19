import { FormEvent, useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

interface LoginPageProps {}

const LoginPage = ({}: LoginPageProps) => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await loginUser(email, password);
      navigate("/");
    } catch (error) {
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Cargando..." : "Iniciar sesión"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
