import { redirect } from 'next/navigation';

// Show all listings regardless of status
export default function AdminListingsPage() {
  redirect('/admin/moderation?status=active');
}
