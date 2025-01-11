"use client"

import { useState, ReactNode } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import axios from 'axios';

interface FormData {
  observations: string;
  duration: number;
  type: string;
  therapistName: string;
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
        {children}
      </div>
    </div>
  );
};

export default function Home() {
  const { control, handleSubmit, formState: { errors }, getValues } = useForm<FormData>();
  const [generatedSummary, setGeneratedSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    const payload = {
      notes: data.observations,
    };
    try {
      const response = await axios.post('http://localhost:8000/generate_session_summary', payload);
      setGeneratedSummary(response.data.session_summary);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error generating session summary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveNotes = async () => {
    const therapistName = getValues('therapistName');
    const duration = getValues('duration');
    const type = getValues('type');
    const patientName = getValues('patientName');
    const dateTime = getValues('dateTime');
    
    const payload = {
      user: therapistName,
      summary: generatedSummary,
      duration: duration,
      type: type,
      patient: patientName,
      date: dateTime,
    };
    try {
      const response = await axios.post('http://localhost:8000/session_summary', payload);
      console.log('Summary saved:', response.data);
    } catch (error) {
      console.error('Error saving summary:', error);
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8 text-center">
      <nav className="w-full bg-gray-800 p-4 fixed top-0">
        <div className="container mx-auto flex justify-center space-x-4">
          <a href="/" className="px-4 py-2 bg-blue-500 text-white rounded">Home</a>
          <a href="/search" className="px-4 py-2 bg-blue-500 text-white rounded">Search</a>
        </div>
      </nav>

      <h1 className="text-3xl font-bold mt-16">Therapist Note Creation Interface</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg space-y-4">
        <div>
          <label className="block text-left">Quick Observations</label>
          <Controller
            name="observations"
            control={control}
            defaultValue=""
            rules={{ required: 'Observations are required' }}
            render={({ field }) => (
              <textarea {...field} className="w-full p-2 border rounded text-slate-800" rows={4} placeholder="Enter observations in bullet points or short form" />
            )}
          />
          {errors.observations && <p className="text-red-500 text-left">{errors.observations.message}</p>}
        </div>

        <div>
          <label className="block text-left">Duration (minutes)</label>
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
          <label className="block text-left">Type</label>
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
          <label className="block text-left">Therapist Name</label>
          <Controller
            name="therapistName"
            control={control}
            defaultValue=""
            rules={{ required: 'Therapist name is required' }}
            render={({ field }) => (
              <input {...field} type="text" className="w-full p-2 border rounded text-slate-800" placeholder="Enter therapist name" />
            )}
          />
          {errors.therapistName && <p className="text-red-500 text-left">{errors.therapistName.message}</p>}
        </div>

        <div>
          <label className="block text-left">Patient Name</label>
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
          <label className="block text-left">Date & Time</label>
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

        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Summary'}
        </button>
      </form>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold text-slate-800">Session Summary</h2>
        <textarea
          className="w-full flex-grow p-2 mt-2 border rounded text-slate-800"
          value={generatedSummary}
          onChange={(e) => setGeneratedSummary(e.target.value)}
        />
        <div className="flex justify-center mt-4">
          <button onClick={saveNotes} className="px-4 py-2 bg-green-500 text-white rounded w-40">
            Save Summary
          </button>
        </div>
      </Modal>
    </div>
  );
}