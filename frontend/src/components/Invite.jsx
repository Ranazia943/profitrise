import React, { useState, useEffect } from "react";
import { useAuthContext } from "../authcontext/AuthContext";
import axios from "axios";

const Invite = () => {
  const { authUser } = useAuthContext();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [referralLink, setReferralLink] = useState("");
  const [copied, setCopied] = useState(false);  // State to track the copy status

  const handleCopyClick = () => {
    const referralCode = authUser.referralCode || "N/A";
    navigator.clipboard.writeText(referralCode).then(() => {
      setCopied(true);  // Set copied state to true when the code is successfully copied
      setTimeout(() => setCopied(false), 2000);  // Reset the copied state after 2 seconds
    }).catch((err) => {
      console.error("Failed to copy referral code: ", err);
    });
  };

  useEffect(() => {
    const fetchReferralData = async () => {
      if (!authUser || !authUser.id) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        console.log("Token from localStorage:", token);  // Log the token to the console
        if (!token) {
          setError("Authentication token missing.");
          setLoading(false);
          return;
        }
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const response = await axios.get(`${baseURL}/api/userplan/user/${authUser.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("API Response:", response.data);  // Add this
        
        if (response.data && response.data.referralCode) {
          const frontendURL = process.env.REACT_APP_FRONTEND_URL || "http://localhost:5173";
          setReferralLink(`${frontendURL}/register?ref=${response.data.referralCode}`);
        } else {
          setError("Referral code not found.");
        }
        
      } catch (err) {
        console.error("Error fetching referral data:", err.message);
        setError("Error fetching referral data.");
      } finally {
        setLoading(false);
      }
    };

    fetchReferralData();
  }, [authUser]);

  return (
    <div>
      <div className="wrapper min-h-[90vh] flex justify-center items-center">
        <div
          data-aos="zoom-in"
          data-aos-duration="1500"
          className="card border max-sm:w-full ml-4 mr-4 md:w-[600px] lg:w-[800px] mx-auto p-4 rounded-md"
        >
          <div>
            <h2 className="text-center font-[800] text-2xl md:text-4xl text-black-400 mt-10">
              Invite Code
            </h2>
            <p className="italic text-center text-lg font-[350] text-black-600">
              Invite your friends who are interested in earning profits. You will get a 3-level commission.
            </p>
            <div className="relative">
              <input
                type="text"
                disabled
                
                value={loading ? "Loading..." : authUser.referralCode || "N/A"}
                className="w-full h-14 rounded-md pl-4 pr-12 border outline-none bg-transparent mt-2"
              />
              <button 
                onClick={handleCopyClick} 
                className="absolute right-3 top-3 p-2 text-red-600 cursor-pointer"
                aria-label="Copy to clipboard"
              >
                {/* Change icon based on copy status */}
                <i className={copied ? "fas fa-check-circle text-green-500" : "fas fa-copy"}></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invite;
