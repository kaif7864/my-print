import React, { useState } from "react";
import axios from "axios";

export default function IDForm() {
  const [formData, setFormData] = useState({
    id_number: "",
    name: "",
    father_name: "",
    dob: "",
  });

  const [photo, setPhoto] = useState(null);
  const [sign, setSign] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null); // 👈 Preview ke liye
  const [signPreview, setSignPreview] = useState(null); // 👈 Preview ke liye
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🛑 Image Handler change kiya: Preview aur file dono set karne ke liye
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "photo") {
          setPhoto(file);
          setPhotoPreview(reader.result);
        } else {
          setSign(file);
          setSignPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 🛑 Remove File Handler
  const removeFile = (type) => {
    if (type === "photo") {
      setPhoto(null);
      setPhotoPreview(null);
    } else {
      setSign(null);
      setSignPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photo || !sign) {
      alert("Photo and Signature required");
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) =>
      data.append(key, formData[key])
    );
    data.append("photo", photo);
    data.append("sign", sign);

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/generate-id",
        data,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Generated_ID.pdf");
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert("Error generating ID");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-4xl"> {/* 👈 Width badha di */}
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Smart ID Generator
        </h2>

        <form onSubmit={handleSubmit}>
          {/* 🛑 GRID LAYOUT ADDED: Data aur Uploads alag karne ke liye */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Side: Data */}
            <div className="space-y-4">
              <input
                type="text"
                name="id_number"
                placeholder="ID Number"
                value={formData.id_number}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              <input
                type="text"
                name="father_name"
                placeholder="Father Name"
                value={formData.father_name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>

            {/* Right Side: Uploads with Preview & Remove */}
            <div className="space-y-6">
              {/* Photo Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Upload Photo
                </label>
                {photoPreview ? (
                  <div className="relative inline-block">
                    <img src={photoPreview} alt="Photo" className="h-24 w-24 object-cover rounded-lg" />
                    <button 
                      type="button"
                      onClick={() => removeFile("photo")}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "photo")} required className="text-sm" />
                )}
              </div>

              {/* Sign Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Upload Signature
                </label>
                {signPreview ? (
                  <div className="relative inline-block">
                    <img src={signPreview} alt="Sign" className="h-24 w-24 object-cover rounded-lg" />
                    <button 
                      type="button"
                      onClick={() => removeFile("sign")}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "sign")} required className="text-sm" />
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition duration-300 mt-8"
          >
            {loading ? "Generating..." : "Generate ID"}
          </button>
        </form>
      </div>
    </div>
  );
}