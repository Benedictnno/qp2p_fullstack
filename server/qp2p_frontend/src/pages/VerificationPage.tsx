import axios from "axios";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

function VerificationPage() {
  const { token } = useParams();
  useEffect(() => {
    const verify = async () => {
      await axios.get(
        `http://localhost:5000/api/v1/auth/verify-email?token=${token}`
      );
    };
    verify();
  }, []);

  return (
    <div className="flex flex-col justify-center text-center items-center h-screen">
      <h1>Welcome to QP2P</h1>
      <h2>Your Email has been successfully Verified</h2>
      <button>
        <Link to={"/set-up-details"}>Click to set Up Your Account</Link>
      </button>
    </div>
  );
}

export default VerificationPage;
