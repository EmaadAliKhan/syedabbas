import Link from 'next/link';
import { headers } from 'next/headers';
import { isAuthenticated } from '@/lib/auth';
import LoginForm from '@/components/admin/LoginForm';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAuthenticated();
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') ?? '';
  const isLoginPage = pathname === '/admin';

  if (!authed && !isLoginPage) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100">
        <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
          <h1 className="mb-8 text-center text-2xl font-light tracking-wide">
            Admin
          </h1>
          <LoginForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {authed && (
        <header className="border-b border-neutral-800">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
            <Link
              href="/admin/inbox"
              className="text-sm font-medium tracking-wide text-neutral-200 hover:text-white"
            >
              Inbox
            </Link>
            <span className="text-xs uppercase tracking-widest text-neutral-500">
              Syed Abbas Admin
            </span>
          </div>
        </header>
      )}
      <main className="mx-auto max-w-4xl px-6 py-8">{children}</main>
    </div>
  );
}
