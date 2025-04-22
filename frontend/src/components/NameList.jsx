import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import apiService from '@/services/apiService';
import { validateName, validateNameForm } from '@/utils/validation';
import ConfirmationModal from '@/components/common/ConfirmationModal';

const NamesList = () => {
  const { token } = useAuth();
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '' });
  const [editValidationErrors, setEditValidationErrors] = useState({
    firstName: '',
    lastName: ''
  });

  // Modal states
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null
  });
  const [saveModal, setSaveModal] = useState({
    isOpen: false,
    id: null
  });

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  useEffect(() => {
    fetchNames();
  }, [token]);

  const fetchNames = async () => {
    try {
      const data = await apiService.getAllNames(token);
      setNames(data);
      setError('');
    } catch (error) {
      setError(error.message || 'Failed to fetch names. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (name) => {
    setEditingId(name.id);
    setEditForm({ firstName: name.firstName, lastName: name.lastName });
    setEditValidationErrors({ firstName: '', lastName: '' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ firstName: '', lastName: '' });
    setEditValidationErrors({ firstName: '', lastName: '' });
  };

  const handleShowUpdateConfirmation = (id) => {
    const validationResult = validateNameForm(editForm.firstName, editForm.lastName);
    setEditValidationErrors({
      firstName: validationResult.firstName,
      lastName: validationResult.lastName
    });

    if (!validationResult.isValid) {
      return;
    }

    setSaveModal({
      isOpen: true,
      id
    });
  };

  const handleUpdate = async (id) => {
    try {
      await apiService.updateName(id, editForm.firstName, editForm.lastName, token);
      await fetchNames();
      setEditingId(null);
      setEditForm({ firstName: '', lastName: '' });
      setEditValidationErrors({ firstName: '', lastName: '' });
    } catch (error) {
      setError(error.message || 'Failed to update name. Please try again later.');
    }
  };

  const handleShowDeleteConfirmation = (id) => {
    setDeleteModal({
      isOpen: true,
      id
    });
  };

  const handleDelete = async (id) => {
    try {
      await apiService.deleteName(id, token);
      await fetchNames();
    } catch (error) {
      setError(error.message || 'Failed to delete name. Please try again later.');
    }
  };

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
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 p-2">
          <table className="table">
            <caption className="caption-bottom mt-4 text-sm opacity-70">
              List of all submitted names
            </caption>
            <thead>
              <tr>
                <th className="w-16">ID</th>
                <th className="w-36">First Name</th>
                <th className="w-36">Last Name</th>
                <th className="w-36">Added On</th>
                <th className="w-20"></th>
              </tr>
            </thead>
            <tbody>
              {names.map((name) => (
                <tr key={name.id} className="group hover:bg-base-200 transition-colors duration-200 hover:cursor-pointer">
                  <td className="px-4">{name.id}</td>
                  <td className="px-4">
                    {editingId === name.id ? (
                      <div className="form-control">
                        <input
                          type="text"
                          value={editForm.firstName}
                          onChange={(e) => {
                            setEditForm({ ...editForm, firstName: e.target.value });
                            setEditValidationErrors(prev => ({
                              ...prev,
                              firstName: validateName(e.target.value, 'First name')
                            }));
                          }}
                          className={`input input-bordered input-sm w-32 ${editValidationErrors.firstName ? 'input-error' : ''}`}
                        />
                        {editValidationErrors.firstName && (
                          <span className="text-error text-xs mt-1">{editValidationErrors.firstName}</span>
                        )}
                      </div>
                    ) : (
                      capitalizeFirstLetter(name.firstName)
                    )}
                  </td>
                  <td className="px-4">
                    {editingId === name.id ? (
                      <div className="form-control">
                        <input
                          type="text"
                          value={editForm.lastName}
                          onChange={(e) => {
                            setEditForm({ ...editForm, lastName: e.target.value });
                            setEditValidationErrors(prev => ({
                              ...prev,
                              lastName: validateName(e.target.value, 'Last name')
                            }));
                          }}
                          className={`input input-bordered input-sm w-32 ${editValidationErrors.lastName ? 'input-error' : ''}`}
                        />
                        {editValidationErrors.lastName && (
                          <span className="text-error text-xs mt-1">{editValidationErrors.lastName}</span>
                        )}
                      </div>
                    ) : (
                      capitalizeFirstLetter(name.lastName)
                    )}
                  </td>
                  <td className="px-4">{new Date(name.createdAt).toLocaleString()}</td>
                  <td className="px-4">
                    {editingId === name.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleShowUpdateConfirmation(name.id)}
                          className="btn btn-success btn-sm"
                          disabled={editValidationErrors.firstName || editValidationErrors.lastName}
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="btn btn-ghost btn-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => handleEdit(name)}
                          className="btn btn-primary btn-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleShowDeleteConfirmation(name.id)}
                          className="btn btn-error btn-sm"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        id="delete-modal"
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={() => handleDelete(deleteModal.id)}
        title="Confirm Deletion"
        message="Are you sure you want to delete this name? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="error"
      />

      {/* Save Confirmation Modal */}
      <ConfirmationModal
        id="save-modal"
        isOpen={saveModal.isOpen}
        onClose={() => setSaveModal({ isOpen: false, id: null })}
        onConfirm={() => handleUpdate(saveModal.id)}
        title="Confirm Update"
        message="Are you sure you want to save these changes?"
        confirmText="Save"
        cancelText="Cancel"
        type="success"
      />
    </div>
  );
};

export default NamesList;
