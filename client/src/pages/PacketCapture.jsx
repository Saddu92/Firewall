import React, { useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

function PacketCapture() {
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [alert, setAlert] = useState("");

  const startCapture = async () => {
    setLoading(true);
    setAlert("");
    try {
      const response = await axios.post("http://127.0.0.1:8000/start-capture-and-predict/");
      setPredictions(response.data.predictions);

      // Show an alert if a threat is detected
      if (response.data.predictions.includes(1)) {
        setAlert("🚨 Suspicious Network Activity Detected!");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Data for charts
  const chartData = predictions.map((val, index) => ({ id: index + 1, status: val ? "Threat" : "Normal" }));
  const pieData = [
    { name: "Normal", value: predictions.filter((p) => p === 0).length },
    { name: "Threat", value: predictions.filter((p) => p === 1).length },
  ];
  const colors = ["#34D399", "#F87171"]; // Green for Normal, Red for Threat

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold">Proactive Firewall Dashboard</h1>

      {alert && <div className="bg-red-500 p-2 rounded mt-3">{alert}</div>}

      <button 
        onClick={startCapture} 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5"
        disabled={loading}
      >
        {loading ? "Capturing..." : "Start Packet Capture"}
      </button>

      {predictions.length > 0 && (
        <div className="w-full flex justify-between mt-6">
          <div className="w-1/2">
            <h2 className="text-xl font-semibold">Packet Predictions</h2>
            <BarChart width={400} height={250} data={chartData}>
              <XAxis dataKey="id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="status" fill="#8884d8" />
            </BarChart>
          </div>
          <div className="w-1/2">
            <h2 className="text-xl font-semibold">Threat Analysis</h2>
            <PieChart width={250} height={250}>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index]} />
                ))}
              </Pie>
            </PieChart>
          </div>
        </div>
      )}
    </div>
  );
}

export default PacketCapture;
