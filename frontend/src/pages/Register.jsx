import AuthForm from "../components/auth/AuthForm";

function Register() {
  return <AuthForm route="/api/user/register/" method="register" />;
}

export default Register;
