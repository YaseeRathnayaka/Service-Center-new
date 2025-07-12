import AuthForm from '../../../components/auth/AuthForm';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <AuthForm mode="login" />
    </div>
  );
} 