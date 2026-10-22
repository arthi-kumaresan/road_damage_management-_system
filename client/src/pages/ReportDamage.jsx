import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import {
  Upload,
  MapPin,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Navigation,
} from 'lucide-react';

const ReportDamage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    roadName: '',
    area: '',
    description: '',
    damageType: 'Pothole',
    severity: 'Medium',
    latitude: '',
    longitude: '',
  });

  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [locationDetecting, setLocationDetecting] = useState(false);

  const damageTypes = [
    'Pothole',
    'Road crack',
    'Damaged road surface',
    'Road collapse',
    'Waterlogging',
    'Broken road edge',
    'Drainage-related road damage',
    'Other',
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.length > 5) {
      return setError('Maximum 5 images allowed');
    }
    setFiles(selected);
    const urls = selected.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
    setError('');
  };

  // Browser Geolocation
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      return setError('Geolocation is not supported by your browser');
    }
    setLocationDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData({
          ...formData,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        });
        setLocationDetecting(false);
      },
      (err) => {
        setError('Failed to retrieve location: ' + err.message);
        setLocationDetecting(false);
      }
    );
  };

  // AI Damage Detection Test Trigger
  const handleAiAnalyze = async () => {
    if (files.length === 0) {
      return setError('Please upload an image first for AI analysis');
    }
    setAiAnalyzing(true);
    setError('');
    try {
      const data = new FormData();
      data.append('image', files[0]);
      const res = await API.post('/ai/detect-damage', data);
      setAiResult(res.data);
      if (res.data.detectedDamage) {
        setFormData((prev) => ({
          ...prev,
          damageType: res.data.detectedDamage,
        }));
      }
    } catch (err) {
      setError('AI model simulation failed');
    } finally {
      setAiAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      return setError('Please upload at least one photograph of the road damage');
    }

    setLoading(true);
    setError('');
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) submitData.append(key, formData[key]);
      });
      files.forEach((file) => {
        submitData.append('images', file);
      });

      const { data } = await API.post('/complaints', submitData);
      navigate(`/complaints/${data.complaint._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-8">
        <div className="mb-6 border-b border-gray-100 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Report Road Damage
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Provide detailed information to assist municipal authorities and maintenance crews
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Road / Street Name *
              </label>
              <input
                type="text"
                name="roadName"
                required
                value={formData.roadName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. Ring Road Link, Sector 12"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Area / Locality *
              </label>
              <input
                type="text"
                name="area"
                required
                value={formData.area}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. North Suburb / Central Ward"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Damage Type *
              </label>
              <select
                name="damageType"
                value={formData.damageType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {damageTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Severity Level *
              </label>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Low">Low - Superficial wear</option>
                <option value="Medium">Medium - Noticeable disruption</option>
                <option value="High">High - Dangerous to two-wheelers</option>
                <option value="Critical">Critical - Major collapse / Severe hazard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Detailed Description *
            </label>
            <textarea
              name="description"
              required
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Describe size, depth, landmark references, or safety risks..."
            />
          </div>

          {/* Location Capture */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" /> GPS Coordinates (Optional)
              </span>
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={locationDetecting}
                className="text-xs bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md flex items-center gap-1 shadow-sm"
              >
                <Navigation className="w-3.5 h-3.5 text-blue-600" />
                {locationDetecting ? 'Fetching...' : 'Detect Current Location'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                name="latitude"
                placeholder="Latitude (e.g. 28.6139)"
                value={formData.latitude}
                onChange={handleInputChange}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs"
              />
              <input
                type="text"
                name="longitude"
                placeholder="Longitude (e.g. 77.2090)"
                value={formData.longitude}
                onChange={handleInputChange}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs"
              />
            </div>
          </div>

          {/* Image Upload Area */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Damage Photographs (Max 5) *
            </label>
            <div className="border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-xl p-6 text-center transition bg-gray-50">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-gray-600 mb-2">
                Upload clear photos of the pothole or damaged road surface
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {/* Preview gallery & AI Trigger */}
            {previewUrls.length > 0 && (
              <div className="mt-4 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {previewUrls.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200 shadow-sm"
                    />
                  ))}
                </div>

                {/* AI Assistant Button */}
                <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 p-3 rounded-lg">
                  <button
                    type="button"
                    onClick={handleAiAnalyze}
                    disabled={aiAnalyzing}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {aiAnalyzing ? 'Analyzing Image...' : 'Run AI Damage Classification'}
                  </button>
                  <span className="text-[11px] text-indigo-700">
                    Runs modular AI detection model to estimate damage type & confidence.
                  </span>
                </div>

                {aiResult && (
                  <div className="bg-white border border-indigo-200 rounded-lg p-3 text-xs space-y-1 shadow-sm">
                    <p className="font-semibold text-indigo-900 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Detected Damage: {aiResult.detectedDamage} ({(aiResult.confidence * 100).toFixed(0)}% Confidence)
                    </p>
                    <p className="text-gray-500 text-[11px]">{aiResult.message}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition shadow-md text-sm disabled:opacity-50"
          >
            {loading ? 'Submitting Damage Report...' : 'Submit Damage Report'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportDamage;
