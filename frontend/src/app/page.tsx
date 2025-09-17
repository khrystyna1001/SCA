'use client';

import { useState, useEffect, FormEvent } from 'react';
import ErrorPage from './error';

interface Target {
  id?: number;
  name: string;
  country: string;
  notes: string;
  state: boolean;
}

interface Mission {
  id: number;
  cat: number | null;
  state: boolean;
  targets: Target[];
}

const API_URL = 'http://127.0.0.1:8000/api/cats';

async function fetcher<T>(url: string, method: string = 'GET', body: any = null): Promise<T> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(JSON.stringify(errorData));
  }
  return response.json();
}

export default function Home() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      const data = await fetcher<Mission[]>(`${API_URL}/missions/`); 
      setMissions(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignCat = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const missionId = formData.get('missionId');
    const catId = formData.get('catId');

    if (!missionId || !catId) {
      alert('Please enter both Mission ID and Cat ID.');
      return;
    }

    try {
      await fetcher(`${API_URL}/missions/${missionId}/assign_cat/`, 'PATCH', { cat: parseInt(catId as string) });
      alert('Cat assigned successfully!');
      fetchMissions();
    } catch (err: any) {
      alert(`Error assigning cat: ${err.message}`);
    }
  };

  const handleCreateMission = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newMissionCatId = formData.get('newMissionCatId');
    const targetName = formData.get('targetName');
    const targetCountry = formData.get('targetCountry');

    if (!targetName || !targetCountry) {
        alert('Please enter Target Name and Target Country.');
        return;
    }

    const missionData = {
      cat: newMissionCatId ? parseInt(newMissionCatId as string) : null,
      targets: [{
        name: targetName,
        country: targetCountry,
        notes: 'Initial notes.',
        state: false
      }]
    };

    try {
      await fetcher(`${API_URL}/missions/`, 'POST', missionData);
      alert('Mission created successfully!');
      e.currentTarget.reset();
      fetchMissions();
    } catch (err: any) {
      alert(`Error creating mission: ${err.message}`);
    }
  };

  const handleCompleteMission = async (missionId: number) => {
    try {
      await fetcher(`${API_URL}/missions/${missionId}/complete_mission/`, 'PATCH', {});
      alert('Mission completed successfully!');
      fetchMissions(); 
    } catch (err: any) {
      alert(`Error completing mission: ${err.message}`);
    }
  };

  return (
    <>
    {error ? (
            <ErrorPage message={error} onRetry={fetchMissions} />
        ) : (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 sm:p-8">
      <div className="container mx-auto bg-white shadow-xl rounded-2xl p-6 sm:p-10 border border-gray-100">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10 tracking-tight">
          Cat Mission Control 🐾
        </h1>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Assign Cat Section */}
          <section className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-gray-800 mb-5">Assign a Cat to a Mission</h2>
            <form onSubmit={handleAssignCat} className="flex flex-col space-y-4">
              <input 
                type="number" 
                name="missionId" 
                placeholder="Mission ID" 
                required 
                className="p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" 
              />
              <input 
                type="number" 
                name="catId" 
                placeholder="Cat ID" 
                required 
                className="p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" 
              />
              <button 
                type="submit" 
                className="bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-colors duration-300 shadow-md"
              >
                Assign Cat
              </button>
            </form>
          </section>

          {/* Create Mission Section */}
          <section className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-gray-800 mb-5">Create a New Mission</h2>
            <form onSubmit={handleCreateMission} className="flex flex-col space-y-4">
              <input 
                type="number" 
                name="newMissionCatId" 
                placeholder="Cat ID (optional)" 
                className="p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 transition-all duration-200" 
              />
              <input 
                type="text" 
                name="targetName" 
                placeholder="Target Name" 
                required 
                className="p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 transition-all duration-200" 
              />
              <input 
                type="text" 
                name="targetCountry" 
                placeholder="Target Country" 
                required 
                className="p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 transition-all duration-200" 
              />
              <button 
                type="submit" 
                className="bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition-colors duration-300 shadow-md"
              >
                Create Mission
              </button>
            </form>
          </section>
        </div>

        <hr className="my-10 border-gray-200" />

        {/* Current Missions Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Current Missions Overview</h2>
          {loading && <p className="text-center text-gray-600 text-lg">Loading missions...</p>}
          {error && <p className="text-center text-red-600 text-lg">Error: {error}</p>}
          {!loading && missions.length === 0 && <p className="text-center text-gray-600 text-lg">No missions found. Create one!</p>}
          
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {!loading && missions.map((mission) => (
              <div key={mission.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 flex flex-col">
                <h3 className="text-xl font-bold text-indigo-700 mb-3 flex items-center">
                  Mission <span className="text-gray-500 text-sm ml-2">#{mission.id}</span>
                </h3>
                <p className="text-gray-700 mb-1">
                  <strong>Assigned Cat:</strong> {mission.cat ? <span className="text-indigo-600 font-medium">{mission.cat}</span> : <span className="text-gray-500 italic">Unassigned</span>}
                </p>
                <p className="text-gray-700 mb-4">
                  <strong>Status:</strong>{' '}
                  <span className={`font-semibold ${mission.state ? 'text-green-600' : 'text-yellow-600'}`}>
                    {mission.state ? 'Completed' : 'Active'}
                  </span>
                </p>

                {!mission.state && (
                <button
                    onClick={() => handleCompleteMission(mission.id)}
                    className="mt-4 bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 transition-colors duration-300 shadow-md"
                >
                    Mark as Completed
                </button>
                )}
                
                <h4 className="font-bold text-gray-800 mb-2 mt-auto">Targets:</h4>
                {mission.targets.length > 0 ? (
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {mission.targets.map((target) => (
                            <li key={target.id || target.name} className="flex items-start">
                                <span className={`w-2 h-2 rounded-full mt-1 mr-2 ${target.state ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                <div>
                                    <strong className="text-indigo-600">{target.name}</strong> ({target.country})<br/>
                                    <span className="text-sm italic text-gray-600">{target.notes}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm italic text-gray-500">No targets for this mission.</p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
        )}
    </>
  );
}