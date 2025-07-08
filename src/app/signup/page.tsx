import AuthForm from '../../components/auth/AuthForm';

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <AuthForm mode="signup" />
    </div>
  );
} 