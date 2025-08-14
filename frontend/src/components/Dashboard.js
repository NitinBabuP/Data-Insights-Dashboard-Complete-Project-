
import React, { useState } from 'react';
import axios from 'axios';
import Chart from './Chart';

function Dashboard() {
    const [file, setFile] = useState(null);
    const [data, setData] = useState(null);
    const [predictions, setPredictions] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file first.');
            return;
        }
        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5001/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            setData(response.data);
            setError('');
            setPredictions(null);
        } catch (err) {
            setError('File upload failed. Please try again.');
            setData(null);
        }
    };

    const handlePredict = async () => {
        if (!data || !data.chart_data) {
            setError('Please upload and process data first.');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5001/api/predict', {
                x_values: data.chart_data.labels,
                y_values: data.chart_data.values
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setPredictions(response.data.predictions);
        } catch (err) {
            setError('Prediction failed.');
        }
    };

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-xl w-full max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">Data Insights Dashboard</h1>
            <div className="flex items-center justify-center space-x-4 mb-6">
                <input type="file" onChange={handleFileChange} accept=".csv" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                <button onClick={handleUpload} className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-all duration-200 shadow-md">Upload & Analyze</button>
            </div>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            {data && (
                <div className="mt-6 space-y-6">
                    <div className="bg-gray-50 p-4 rounded-md shadow-inner">
                        <h2 className="text-xl font-semibold mb-2 text-gray-600">Data Summary</h2>
                        <pre className="text-sm bg-gray-200 p-3 rounded overflow-x-auto">{JSON.stringify(data.summary, null, 2)}</pre>
                    </div>
                    
                    {data.chart_data && data.chart_data.labels && (
                        <div className="mt-6">
                           <h2 className="text-xl font-semibold mb-2 text-gray-600">Data Visualization</h2>
                           <div className="p-4 border rounded-md bg-white shadow">
                             <Chart chartData={data.chart_data} />
                           </div>
                           <div className="text-center mt-4">
                            <button onClick={handlePredict} className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-all duration-200 shadow-md">Get Predictions</button>
                           </div>
                        </div>
                    )}
                </div>
            )}
            
            {predictions && (
                <div className="mt-6 bg-gray-50 p-4 rounded-md shadow-inner">
                    <h2 className="text-xl font-semibold mb-2 text-gray-600">Predicted Values (Next 5 Steps)</h2>
                    <p className="text-lg font-mono bg-gray-200 p-3 rounded text-center">{predictions.map(p => p.toFixed(2)).join(', ')}</p>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
