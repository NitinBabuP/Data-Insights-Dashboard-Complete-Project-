import React, { useState } from 'react';
import axios from 'axios';
import Chart from './Chart';

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle file upload and processing
  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5001/api/upload', 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setData(response.data);
      setPredictions(null);
    } catch (err) {
      setError('Failed to process file. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle prediction generation
  const handlePredict = async () => {
    if (!data?.chart_data) {
      setError('Please upload data first');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5001/api/predict',
        {
          x_values: data.chart_data.labels,
          y_values: data.chart_data.values
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setPredictions(response.data.predictions);
    } catch (err) {
      setError('Prediction failed. Please try again.');
      console.error('Prediction error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Data Insights Dashboard</h1>
          <p className="text-gray-600 mt-2">Upload CSV files for analysis and predictions</p>
        </header>

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              accept=".csv"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            <button
              onClick={handleUpload}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Analyze'}
            </button>
          </div>
          {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}
        </div>

        {/* Results Section */}
        {data && (
          <div className="space-y-6">
            {/* Data Summary */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Data Summary</h2>
              <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm text-gray-800">
                  {JSON.stringify(data.summary, null, 2)}
                </pre>
              </div>
            </div>

            {/* Visualization */}
            {data.chart_data && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Visualization</h2>
                  <button
                    onClick={handlePredict}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Predict Trends
                  </button>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <Chart chartData={data.chart_data} />
                </div>
              </div>
            )}

            {/* Predictions */}
            {predictions && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Predictions (Next 5 Values)</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-mono text-lg text-center">
                    {predictions.map((p, i) => (
                      <span key={i} className="mx-2">
                        {p.toFixed(2)}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;