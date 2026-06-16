import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import LoginForm from '@/components/admin/LoginForm';

export default async function AdminPage() {
  const authed = await isAuthenticated();

  if (authed) {
    redirect('/admin/inbox');
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="mb-8 text-2xl font-light tracking-wide">Admin Login</h1>
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
