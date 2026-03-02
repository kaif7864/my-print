import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiCreditCard } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom"; // ✨ useNavigate add kiya
import Sidebar from "./Sidebar";
import { load } from "@cashfreepayments/cashfree-js";

export default function AddMoneyPage() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [cashfree, setCashfree] = useState(null); // ✨ SDK instance state
  const navigate = useNavigate(); // ✨ Navigation ke liye
  const predefinedAmounts = [50, 100, 200, 500];

  // ✨ SDK ko initialize karein jab page load ho
  useEffect(() => {
    const initializeSDK = async function () {
      const cf = await load({ mode: "sandbox" }); // Production mein "production" karein
      setCashfree(cf);
    };
    initializeSDK();
  }, []);

  const handleRecharge = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    if (!cashfree) {
      alert("Payment SDK not loaded yet. Please wait.");
      return;
    }

    setLoading(true);

    try {
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) {
        alert("User not logged in");
        setLoading(false);
        return;
      }

      // 1. Backend se Order Session ID lein
      const response = await fetch("http://localhost:5000/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          email: userEmail,
        }),
      });

      const orderData = await response.json();

      if (orderData.payment_session_id) {
        // 2. Checkout setup karein
        let checkoutOptions = {
          paymentSessionId: orderData.payment_session_id,
          // ✨ Return URL ko confirm karein ki ye sahi page par redirect ho
          returnUrl: "http://localhost:5173/wallet", 
        };
        
        // 3. Payment popup open karein
        cashfree.checkout(checkoutOptions).then(function (result) {
          if (result.error) {
            alert("Payment failed: " + result.error.message);
          } else {
            // Payment initiate ho gayi, ab webhook ka wait karein
            alert("Payment Processing...");
            navigate("/wallet"); // ✨ Wallet page par bhej dein
          }
        });
      } else {
        alert("Failed to create order: " + (orderData.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex">
      <Sidebar />

      <main className="flex-1 overflow-y-auto h-screen p-4 md:p-8">
        <header className="mb-8">
          <Link to="/wallet" className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-2">
            <FiArrowLeft /> Back to Wallet
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900">Add Money</h1>
          <p className="text-gray-500 mt-1">Select an amount to recharge your wallet.</p>
        </header>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm max-w-2xl">
          <form onSubmit={handleRecharge} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Choose Amount</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {predefinedAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt)}
                    className={`py-3 rounded-xl border-2 text-lg font-bold transition ${
                      amount === amt
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 hover:border-indigo-200 text-gray-700"
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !cashfree}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-lg disabled:bg-gray-400"
            >
              {loading ? "Processing..." : <><FiCreditCard size={20} /> Pay ₹{amount || "0"}</>}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}