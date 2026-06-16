import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import InquiryList from '@/components/admin/InquiryList';

export default async function AdminInboxPage() {
  const authed = await isAuthenticated();

  if (!authed) {
    redirect('/admin');
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-light tracking-wide">Inquiries</h1>
      <InquiryList />
    </div>
  );
}
