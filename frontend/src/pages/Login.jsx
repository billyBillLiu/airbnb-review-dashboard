import AuthForm from "../components/auth/AuthForm";

function Login() {
  return <AuthForm route="/api/token/" method="login" />;
}

export default Login;
