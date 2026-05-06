import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";

export default function PricingManager() {
  const [pricings, setPricings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchPricings();
  }, []);

  const fetchPricings = async () => {
    try {
      const response = await axios.get("http://localhost:8000/pricing");
      // If db is empty, provide defaults or let user add them
      if (response.data.length === 0) {
          setPricings([
              { course_name: "Full Stack Development", standard_price: 35000, offer_price: 30000 },
              { course_name: "Backend Development", standard_price: 25000, offer_price: 20000 },
              { course_name: "Frontend Development", standard_price: 20000, offer_price: 15000 }
          ]);
      } else {
          setPricings(response.data);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch pricings");
      setLoading(false);
    }
  };

  const handleChange = (index, field, value) => {
    const updatedPricings = [...pricings];
    updatedPricings[index][field] = value;
    setPricings(updatedPricings);
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(null);
    try {
      await axios.post(
        "http://localhost:8000/admin/pricing",
        pricings,
        {
          headers: {
            Authorization: `Bearer ${user?.access_token}`
          }
        }
      );
      setSuccess("Pricing updated successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to update pricing. Are you logged in as admin?");
    }
  };

  if (loading) {
    return <div className="text-white text-center mt-20">Loading pricing data...</div>;
  }

  return (
    <div className="min-h-screen bg-black pt-24 px-6 pb-12 flex justify-center text-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full bg-white/5 rounded-2xl border border-white/10 p-8"
      >
        <h2 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
          Manage Course Pricing
        </h2>

        {error && <div className="bg-red-500/20 text-red-400 p-4 rounded-lg mb-6">{error}</div>}
        {success && <div className="bg-green-500/20 text-green-400 p-4 rounded-lg mb-6">{success}</div>}

        <div className="space-y-6">
          {pricings.map((pricing, index) => (
            <div key={pricing.id || index} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end bg-white/5 p-6 rounded-xl border border-white/10">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Course Name</label>
                <input
                  type="text"
                  value={pricing.course_name}
                  onChange={(e) => handleChange(index, 'course_name', e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Standard Price (₹)</label>
                <input
                  type="number"
                  value={pricing.standard_price}
                  onChange={(e) => handleChange(index, 'standard_price', e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Offer Price (₹)</label>
                <input
                  type="number"
                  value={pricing.offer_price}
                  onChange={(e) => handleChange(index, 'offer_price', e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-semibold hover:from-red-500 hover:to-red-400 transition-all duration-300 transform hover:scale-105"
          >
            Save All Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
}
