import { useEffect, useState } from 'react';
import apiService from '@/services/apiService';

const NamesList = () => {
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNames = async () => {
      try {
        const data = await apiService.getAllNames();
        setNames(data);
        setError('');
      } catch (error) {
        setError(error.message || 'Failed to fetch names. Please try again later.');
        setError('Failed to fetch names. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNames();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error mt-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">All Names</h2>

      {names.length === 0 ? (
        <div className="alert alert-info">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span>No names have been added yet.</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <caption className="caption-bottom mt-4 text-sm opacity-70">
              List of all submitted names
            </caption>
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Added On</th>
              </tr>
            </thead>
            <tbody>
              {names.map((name) => (
                <tr key={name.id}>
                  <td>{name.id}</td>
                  <td>{name.firstName}</td>
                  <td>{name.lastName}</td>
                  <td>
                    {new Date(name.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default NamesList;
