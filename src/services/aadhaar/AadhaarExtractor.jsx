import React, { useState } from "react";
import { extractAadhaar } from "./extractService";
import { generateAadhaar } from "./makerService";

const AadhaarExtractor = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rawText, setRawText] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("wallet");

  const [data, setData] = useState({
    name_english: "",
    name_hindi: "",
    father_english: "",
    father_hindi: "",
    dob: "",
    gender: "male",
    aadhaar_number: "",
    address_english: "",
    address_hindi: "",
    vid_number: "",
    issued_date: "",
    details_as_on: "",
    email: "",
    photo_base64: ""
  });

  // 📌 Extract Function
  const handleExtract = async () => {
    if (!file) {
      alert("Upload PDF first");
      return;
    }

    try {
      setLoading(true);
      const result = await extractAadhaar(file);

      setRawText(result.raw_text || "");

      setData({
        name_english: result.name_english || "",
        name_hindi: result.name_hindi || "",
        father_english: result.father_english || "",
        father_hindi: result.father_hindi || "",
        dob: result.dob || "",
        gender: result.gender?.toLowerCase() || "male",
        aadhaar_number: result.aadhaar_number || "",
        address_english: result.address_english || "",
        address_hindi: result.address_hindi || "",
        vid_number: result.vid_number || "",
        issued_date: result.issued_date || "",
        details_as_on: result.details_as_on || "",
        email: result.email || "",
        photo_base64: result.photo_base64 || ""
      });

    } catch (error) {
      console.error(error);
      alert("Extraction failed");
    } finally {
      setLoading(false);
    }
  };

  // 📌 Generate Function
  const handleGenerate = async () => {
    try {
      const response = await generateAadhaar(data, paymentMethod);

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "aadhaar_generated.pdf";
      a.click();

      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error(error);
      alert("Generation failed");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">Aadhaar Extractor</h1>

      {/* Upload */}
      <div className="mb-4">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2"
        />
      </div>

      <button
        onClick={handleExtract}
        className="bg-indigo-600 text-white px-6 py-2 rounded mb-6"
      >
        {loading ? "Extracting..." : "Extract Data"}
      </button>

      {/* Raw Extracted Text */}
      {rawText && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Extracted Text:</h2>
          <textarea
            value={rawText}
            readOnly
            className="w-full border p-3 h-40 rounded"
          />
        </div>
      )}

      {/* Form Fields */}
      <div className="grid grid-cols-2 gap-4">

        <input
          placeholder="Name (English)"
          value={data.name_english}
          onChange={(e) => setData({...data, name_english: e.target.value})}
          className="border p-2 rounded"
        />

        <input
          placeholder="Name (Hindi)"
          value={data.name_hindi}
          onChange={(e) => setData({...data, name_hindi: e.target.value})}
          className="border p-2 rounded"
        />

        <input
          placeholder="Father (English)"
          value={data.father_english}
          onChange={(e) => setData({...data, father_english: e.target.value})}
          className="border p-2 rounded"
        />

        <input
          placeholder="Father (Hindi)"
          value={data.father_hindi}
          onChange={(e) => setData({...data, father_hindi: e.target.value})}
          className="border p-2 rounded"
        />

        <input
          placeholder="DOB"
          value={data.dob}
          onChange={(e) => setData({...data, dob: e.target.value})}
          className="border p-2 rounded"
        />

        <input
          placeholder="Aadhaar Number"
          value={data.aadhaar_number}
          onChange={(e) => setData({...data, aadhaar_number: e.target.value})}
          className="border p-2 rounded"
        />

        <input
          placeholder="VID Number"
          value={data.vid_number}
          onChange={(e) => setData({...data, vid_number: e.target.value})}
          className="border p-2 rounded"
        />

        <input
          placeholder="Issued Date"
          value={data.issued_date}
          onChange={(e) => setData({...data, issued_date: e.target.value})}
          className="border p-2 rounded"
        />

        <input
          placeholder="Details As On"
          value={data.details_as_on}
          onChange={(e) => setData({...data, details_as_on: e.target.value})}
          className="border p-2 rounded"
        />

        <input
          placeholder="Email"
          value={data.email}
          onChange={(e) => setData({...data, email: e.target.value})}
          className="border p-2 rounded"
        />

      </div>

      {/* Address */}
      <textarea
        placeholder="Address (English)"
        value={data.address_english}
        onChange={(e) => setData({...data, address_english: e.target.value})}
        className="w-full border p-2 rounded mt-4"
      />

      <textarea
        placeholder="Address (Hindi)"
        value={data.address_hindi}
        onChange={(e) => setData({...data, address_hindi: e.target.value})}
        className="w-full border p-2 rounded mt-4"
      />

      {/* Gender Toggle */}
      <div className="mt-6">
        <label className="font-semibold block mb-2">Gender</label>

        <div className="flex gap-4">
          <button
            onClick={() => setData({...data, gender: "male"})}
            className={`px-4 py-2 rounded border ${
              data.gender === "male"
                ? "bg-indigo-600 text-white"
                : "bg-white"
            }`}
          >
            Male
          </button>

          <button
            onClick={() => setData({...data, gender: "female"})}
            className={`px-4 py-2 rounded border ${
              data.gender === "female"
                ? "bg-pink-600 text-white"
                : "bg-white"
            }`}
          >
            Female
          </button>
        </div>
      </div>

      {/* Payment */}
      <div className="mt-6">
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="wallet">Wallet</option>
          <option value="cashfree">Cashfree</option>
        </select>
      </div>

      <button
        onClick={handleGenerate}
        className="bg-green-600 text-white px-6 py-2 rounded mt-6"
      >
        Generate Aadhaar PDF
      </button>

    </div>
  );
};

export default AadhaarExtractor;