import { useState } from 'react';
import apiService from '@/services/apiService';

const NameForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName) {
      setError('Please enter both first and last name');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await apiService.addName(firstName, lastName);
      setSuccess(true);
      setFirstName('');
      setLastName('');

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      setError(error.message || 'Failed to submit name. Please try again.');
      setError('Failed to submit name. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card max-w-md mx-auto bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold mb-6 text-center text-base-content">Add New Name</h2>

        {error && (
          <div className="alert alert-error mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Name submitted successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text text-base-content">First Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter first name"
              className="input input-bordered w-full bg-base-200 text-base-content"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="form-control w-full mb-6">
            <label className="label">
              <span className="label-text text-base-content">Last Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter last name"
              className="input input-bordered w-full bg-base-200 text-base-content"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className={`btn btn-primary w-full ${isSubmitting ? 'loading' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NameForm;
