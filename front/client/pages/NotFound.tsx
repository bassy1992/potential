import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-bold text-real-red mb-4">404</h1>
          <p className="text-3xl font-bold text-real-dark-blue mb-2">Page Not Found</p>
          <p className="text-lg text-gray-600 mb-8 max-w-md">
            Sorry, the page you're looking for doesn't exist. It might have been moved or removed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button className="bg-real-red hover:bg-real-red/90 text-white px-8 py-3 gap-2">
                <ArrowLeft size={20} />
                Back to Home
              </Button>
            </Link>
            <Link to="/properties">
              <Button variant="outline" className="border-real-dark-blue text-real-dark-blue hover:bg-gray-50 px-8 py-3">
                View Properties
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
