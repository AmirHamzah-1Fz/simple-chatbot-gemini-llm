import HomeContent from "@/components/home/HomeContent";
import Layout from "@/components/Layout";

// This ensures the page is dynamically rendered
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <Layout>
      <HomeContent />
    </Layout>
  );
}
