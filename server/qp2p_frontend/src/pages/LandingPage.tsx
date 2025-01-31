import Burger from "@/components/ui/Burger";
import { Link, Outlet } from "react-router-dom";


const QP2PLanding = () => {
 

  return (
    <div>
      {/* Navigation */}
      <nav className="bg-white shadow-md py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
         
            <Link className="text-2xl font-bold text-blue-600" to={"/"}>
              QP2P
            </Link>
          
          <ul className="max-sm:hidden flex space-x-6 text-gray-700">
            <Link to={"/"} className="hover:text-blue-600 cursor-pointer">
              Home
            </Link>
            <Link to={"/"} className="hover:text-blue-600 cursor-pointer">
              Features
            </Link>
            <Link to={"/about"} className="hover:text-blue-600 cursor-pointer">
              About
            </Link>
            <Link to={"/about"} className="hover:text-blue-600 cursor-pointer">
              Contact
            </Link>
          </ul>
          <Burger />
          <div className="space-x-4 max-sm:hidden">
            <Link
              to={"/login"}
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
            >
              Login
            </Link>
            <Link
              to={"/sign-up"}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <Outlet />
    </div>
  );
};

export default QP2PLanding;
