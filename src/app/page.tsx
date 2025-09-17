import ClientPage from "./(public)/client-page";

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function Home() {
  return <ClientPage />;
}
