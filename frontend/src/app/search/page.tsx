"use client"

import { useState, ReactNode } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';

interface FormData {
  summary: string;
  duration: number;
  type: string;
  patientName: string;
  dateTime: string;
}

const Modal = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: ReactNode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white p-4 rounded shadow-lg w-full max-w-4xl h-3/4 flex flex-col">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>
          &times;
        </button>
        <div className="flex-grow overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function Search() {
  const { control, handleSubmit, formState: { errors }, setValue, getValues } = useForm<FormData>();
  const [therapistName, setTherapistName] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://localhost:8000/user_session_summaries', {
        params: { user: therapistName },
      });
      console.log(response.data);
      setSearchResults(response.data.sessions);
    } catch (error) {
      console.error('Error fetching summaries:', error);
    }
  };

  const handleDelete = async (sessionId: string) => {
    try {
      await axios.delete(`http://localhost:8000/session_summary?session_id=${sessionId}`);
      handleSearch(); // Refresh the search results
    } catch (error) {
      console.error('Error deleting summary:', error);
    }
  };

  const handleView = (session: any) => {
    setCurrentSessionId(session.id);
    setValue('summary', session.summary);
    setValue('duration', session.duration);
    setValue('type', session.type);
    setValue('patientName', session.patient);
    setValue('dateTime', session.date);
    setIsModalOpen(true);
  };

  const saveNotes = async () => {
    setIsLoading(true);
    const summary = getValues('summary');
    const duration = getValues('duration');
    const type = getValues('type');
    const patientName = getValues('patientName');
    const dateTime = getValues('dateTime');

    const payload = {
      id: currentSessionId,
      user: therapistName,
      summary: summary,
      duration: duration,
      type: type,
      patient: patientName,
      date: dateTime,
    };
    try {
      const response = await axios.post('http://localhost:8000/session_summary', payload);
      console.log('Summary saved:', response.data);
      setIsModalOpen(false);
      handleSearch(); // Refresh the search results
    } catch (error) {
      console.error('Error saving summary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const truncateSummary = (summary: string) => {
    const words = summary.split(' ');
    if (words.length > 10) {
      return words.slice(0, 10).join(' ') + '...';
    }
    return summary;
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8 text-center">
      <nav className="w-full bg-gray-800 p-4 fixed top-0">
        <div className="container mx-auto flex justify-center space-x-4">
          <a href="/" className="px-4 py-2 bg-blue-500 text-white rounded">Home</a>
          <a href="/search" className="px-4 py-2 bg-blue-500 text-white rounded">Search</a>
        </div>
      </nav>

      <h1 className="text-3xl font-bold mt-16">Search Summaries</h1>

      <div className="w-full max-w-lg space-y-4">
        <div>
          <label className="block text-left text-white">Search Summaries By Therapist Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded text-slate-800"
            value={therapistName}
            onChange={(e) => setTherapistName(e.target.value)}
            placeholder="Enter therapist name"
          />
        </div>

        <button onClick={handleSearch} className="px-4 py-2 bg-blue-500 text-white rounded">
          Search
        </button>
      </div>

      {searchResults.length > 0 && (
        <div className="w-full max-w-lg mt-8 space-y-4">
          <h2 className="text-xl font-bold text-blue-800">Search Results</h2>
          <ul className="space-y-2 text-slate-800">
            {searchResults.map((result, index) => (
              <li key={index} className="flex flex-col p-4 bg-gray-100 rounded shadow">
                <div className="flex justify-between">
                  <span className="font-semibold">Patient:</span>
                  <span>{result.patient}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Type:</span>
                  <span>{result.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Date:</span>
                  <span>{result.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Duration:</span>
                  <span>{result.duration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Summary:</span>
                  <span>{truncateSummary(result.summary)}</span>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button onClick={() => handleView(result)} className="px-4 py-2 bg-green-500 text-white rounded">View</button>
                  <button onClick={() => handleDelete(result.id)} className="px-4 py-2 bg-red-500 text-white rounded">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold text-slate-800">Edit Session Summary</h2>
        <form onSubmit={handleSubmit(saveNotes)} className="w-full h-250 flex flex-col space-y-2">
          <div className="overflow-auto space-y-2">
            <div>
              <label className="block text-left text-slate-800">Patient Name</label>
              <Controller
                name="patientName"
                control={control}
                defaultValue=""
                rules={{ required: 'Patient name is required' }}
                render={({ field }) => (
                  <input {...field} type="text" className="w-full p-2 border rounded text-slate-800" placeholder="Enter patient name" />
                )}
              />
              {errors.patientName && <p className="text-red-500 text-left">{errors.patientName.message}</p>}
            </div>

            <div>
              <label className="block text-left text-slate-800">Type</label>
              <Controller
                name="type"
                control={control}
                defaultValue=""
                rules={{ required: 'Type is required' }}
                render={({ field }) => (
                  <select {...field} className="w-full p-2 border rounded text-slate-800">
                    <option value="" disabled>Select type</option>
                    <option value="initial_consultation">Initial Consultation</option>
                    <option value="follow_up_consultation">Follow-Up Consultation</option>
                    <option value="therapy_session">Therapy Session</option>
                  </select>
                )}
              />
              {errors.type && <p className="text-red-500 text-left">{errors.type.message}</p>}
            </div>

            <div>
              <label className="block text-left text-slate-800">Date & Time</label>
              <Controller
                name="dateTime"
                control={control}
                defaultValue=""
                rules={{ required: 'Date and time are required' }}
                render={({ field }) => (
                  <input {...field} type="datetime-local" className="w-full p-2 border rounded text-slate-800" />
                )}
              />
              {errors.dateTime && <p className="text-red-500 text-left">{errors.dateTime.message}</p>}
            </div>

            <div>
              <label className="block text-left text-slate-800">Duration (minutes)</label>
              <Controller
                name="duration"
                control={control}
                defaultValue={0}
                rules={{ required: 'Duration is required', min: { value: 1, message: 'Duration must be at least 1 minute' } }}
                render={({ field }) => (
                  <input {...field} type="number" className="w-full p-2 border rounded text-slate-800" placeholder="Enter duration in minutes" />
                )}
              />
              {errors.duration && <p className="text-red-500 text-left">{errors.duration.message}</p>}
            </div>

            <div>
              <label className="block text-left text-slate-800">Summary</label>
              <Controller
                name="summary"
                control={control}
                defaultValue=""
                rules={{ required: 'Summary is required' }}
                render={({ field }) => (
                  <textarea {...field} className="w-full h-60 p-2 border rounded text-slate-800" rows={4} placeholder="Enter summary" />
                )}
              />
              {errors.summary && <p className="text-red-500 text-left">{errors.summary.message}</p>}
            </div>
          </div>

          <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </Modal>
    </div>
  );
}