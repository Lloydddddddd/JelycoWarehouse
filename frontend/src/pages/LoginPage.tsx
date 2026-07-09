import Login from "../components/Login";

interface Props {
  onLogin: (token: string) => void;
}

export default function LoginPage({ onLogin }: Props) {
  return <Login onLogin={onLogin} />;
}