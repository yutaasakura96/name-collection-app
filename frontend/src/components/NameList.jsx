import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import apiService from "@/services/apiService";
import { validateName, validateNameForm } from "@/utils/validation";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import Pagination from "@/components/common/Pagination";
import { ChevronUp, ChevronDown, Search, RotateCcw, Info } from "lucide-react";

const NamesList = () => {
  const { token } = useAuth();
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ firstName: "", lastName: "" });
  const [editValidationErrors, setEditValidationErrors] = useState({
    firstName: "",
    lastName: "",
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 5,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: false,
  });

  // Sorting state
  const [sorting, setSorting] = useState({
    sortBy: "createdAt",
    sortDirection: "DESC",
  });

  // Filtering state
  const [filters, setFilters] = useState({
    searchTerm: "",
  });

  // Search form state (for filters)
  const [searchForm, setSearchForm] = useState({
    searchTerm: "",
  });

  // Modal states
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    uuid: null,
  });
  const [saveModal, setSaveModal] = useState({
    isOpen: false,
    uuid: null,
  });

  // Capitalize the first letter of a string
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  // Utility function to format the UUID for display
  const formatUuid = (uuid) => {
    if (!uuid) return "";
    return uuid.slice(-8).toUpperCase();
  };

  // Add copy to clipboard function
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error("Failed to copy text: ", err);
      return false;
    }
  };

  // Add state for copy feedback
  const [copiedUuid, setCopiedUuid] = useState(null);

  const fetchNames = useCallback(async () => {
    setLoading(true);
    try {
      const searchCriteria = {
        ...filters,
        ...sorting,
        page: pagination.pageNumber,
        size: pagination.pageSize,
      };

      const data = await apiService.searchNames(searchCriteria, token);
      setNames(data.content);
      setPagination({
        pageNumber: data.pageNumber,
        pageSize: data.pageSize,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        first: data.first,
        last: data.last,
      });
      setError("");
    } catch (error) {
      setError(error.message || "Failed to fetch names. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [token, filters, sorting, pagination.pageNumber, pagination.pageSize]);

  useEffect(() => {
    fetchNames();
  }, [fetchNames]);

  const handleEdit = (name) => {
    setEditingId(name.uuid);
    setEditForm({ firstName: name.firstName, lastName: name.lastName });
    setEditValidationErrors({ firstName: "", lastName: "" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ firstName: "", lastName: "" });
    setEditValidationErrors({ firstName: "", lastName: "" });
  };

  const handleShowUpdateConfirmation = (uuid) => {
    const validationResult = validateNameForm(editForm.firstName, editForm.lastName);
    setEditValidationErrors({
      firstName: validationResult.firstName,
      lastName: validationResult.lastName,
    });

    if (!validationResult.isValid) {
      return;
    }

    setSaveModal({
      isOpen: true,
      uuid,
    });
  };

  const handleUpdate = async (uuid) => {
    try {
      await apiService.updateName(uuid, editForm.firstName, editForm.lastName, token);
      await fetchNames();
      setEditingId(null);
      setEditForm({ firstName: "", lastName: "" });
      setEditValidationErrors({ firstName: "", lastName: "" });
    } catch (error) {
      setError(error.message || "Failed to update name. Please try again later.");
    }
  };

  const handleShowDeleteConfirmation = (uuid) => {
    setDeleteModal({
      isOpen: true,
      uuid,
    });
  };

  const handleDelete = async (uuid) => {
    try {
      await apiService.deleteName(uuid, token);
      await fetchNames();
    } catch (error) {
      setError(error.message || "Failed to delete name. Please try again later.");
    }
  };

  const handleSort = (field) => {
    setSorting((prev) => ({
      sortBy: field,
      sortDirection: prev.sortBy === field && prev.sortDirection === "ASC" ? "DESC" : "ASC",
    }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({
      ...prev,
      pageNumber: newPage,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({
      searchTerm: searchForm.searchTerm,
    });
    setPagination((prev) => ({
      ...prev,
      pageNumber: 0,
    }));
  };

  const handleReset = () => {
    setSearchForm({
      searchTerm: "",
    });
    setFilters({
      searchTerm: "",
    });
    setSorting({
      sortBy: "createdAt",
      sortDirection: "DESC",
    });
    setPagination((prev) => ({
      ...prev,
      pageNumber: 0,
    }));
  };

  const getSortIcon = (field) => {
    const isActive = sorting.sortBy === field;
    const iconColor = isActive ? "text-primary" : "text-base-content/30";
    return sorting.sortDirection === "ASC" ? (
      <ChevronUp className={`inline-block h-4 w-4 ${iconColor}`} />
    ) : (
      <ChevronDown className={`inline-block h-4 w-4 ${iconColor}`} />
    );
  };

  if (loading && pagination.pageNumber === 0) {
    return (
      <div className="flex justify-center items-center mt-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">All Names</h2>

      {/* Search/Filter Form */}
      <div className="mb-6 p-4 bg-base-200 rounded-lg shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Search Name</span>
            </label>
            <input
              type="text"
              placeholder="Search by first name or last name"
              className="input input-bordered input-sm w-full max-w-xs"
              value={searchForm.searchTerm}
              onChange={(e) => setSearchForm({ ...searchForm, searchTerm: e.target.value })}
            />
          </div>

          <div className="flex gap-5">
            <button type="submit" className="btn btn-primary btn-sm">
              <Search className="h-4 w-4 mr-1" />
              Search
            </button>
            <button type="button" onClick={handleReset} className="btn btn-soft btn-sm">
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="alert alert-error mt-4 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {names.length === 0 ? (
        <div className="alert alert-info">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>
            {filters.searchTerm
              ? "No names match the current search."
              : "No names have been added yet."}
          </span>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 p-2">
            <table className="table">
              <caption className="caption-bottom mt-4 text-sm opacity-70">
                List of all submitted names
              </caption>
              <thead>
                <tr>
                  <th className="w-16">ID</th>
                  <th className="w-36">
                    <button
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                      onClick={() => handleSort("firstName")}
                    >
                      First Name {getSortIcon("firstName")}
                    </button>
                  </th>
                  <th className="w-36">
                    <button
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                      onClick={() => handleSort("lastName")}
                    >
                      Last Name {getSortIcon("lastName")}
                    </button>
                  </th>
                  <th className="w-36">
                    <button
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                      onClick={() => handleSort("createdAt")}
                    >
                      Added On {getSortIcon("createdAt")}
                    </button>
                  </th>
                  <th className="w-20"></th>
                </tr>
              </thead>
              <tbody>
                {names.map((name) => (
                  <tr
                    key={name.uuid}
                    className="group hover:bg-base-200 transition-colors duration-200 hover:cursor-pointer"
                  >
                    <td className="px-4">
                      <div
                        className="tooltip tooltip-bottom"
                        data-tip={copiedUuid === name.uuid ? "Copied!" : "Click to copy full ID"}
                      >
                        <button
                          onClick={async () => {
                            const success = await copyToClipboard(name.uuid);
                            if (success) {
                              setCopiedUuid(name.uuid);
                              setTimeout(() => setCopiedUuid(null), 2000);
                            }
                          }}
                          className="btn btn-ghost hover:btn-primary transition-colors duration-200 cursor-pointer"
                        >
                          {formatUuid(name.uuid)}
                          <Info size={14} className="text-base" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4">
                      {editingId === name.uuid ? (
                        <div className="form-control">
                          <input
                            type="text"
                            value={editForm.firstName}
                            onChange={(e) => {
                              setEditForm({ ...editForm, firstName: e.target.value });
                              setEditValidationErrors((prev) => ({
                                ...prev,
                                firstName: validateName(e.target.value, "First name"),
                              }));
                            }}
                            className={`input input-bordered input-sm w-32 ${
                              editValidationErrors.firstName ? "input-error" : ""
                            }`}
                          />
                          {editValidationErrors.firstName && (
                            <span className="text-error text-xs mt-1">
                              {editValidationErrors.firstName}
                            </span>
                          )}
                        </div>
                      ) : (
                        capitalizeFirstLetter(name.firstName)
                      )}
                    </td>
                    <td className="px-4">
                      {editingId === name.uuid ? (
                        <div className="form-control">
                          <input
                            type="text"
                            value={editForm.lastName}
                            onChange={(e) => {
                              setEditForm({ ...editForm, lastName: e.target.value });
                              setEditValidationErrors((prev) => ({
                                ...prev,
                                lastName: validateName(e.target.value, "Last name"),
                              }));
                            }}
                            className={`input input-bordered input-sm w-32 ${
                              editValidationErrors.lastName ? "input-error" : ""
                            }`}
                          />
                          {editValidationErrors.lastName && (
                            <span className="text-error text-xs mt-1">
                              {editValidationErrors.lastName}
                            </span>
                          )}
                        </div>
                      ) : (
                        capitalizeFirstLetter(name.lastName)
                      )}
                    </td>
                    <td className="px-4">{new Date(name.createdAt).toLocaleString()}</td>
                    <td className="px-4">
                      {editingId === name.uuid ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleShowUpdateConfirmation(name.uuid)}
                            className="btn btn-success btn-sm"
                            disabled={
                              editValidationErrors.firstName || editValidationErrors.lastName
                            }
                          >
                            Save
                          </button>
                          <button onClick={handleCancelEdit} className="btn btn-ghost btn-sm">
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => handleEdit(name)}
                            className="btn btn-primary btn-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleShowDeleteConfirmation(name.uuid)}
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

          {/* Pagination Controls */}
          <div className="flex justify-center mt-6">
            <Pagination
              currentPage={pagination.pageNumber}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              isFirst={pagination.first}
              isLast={pagination.last}
            />
          </div>

          <div className="flex justify-between items-center mt-4 text-sm text-base-content/70">
            <div>
              Showing {names.length} of {pagination.totalElements} entries
            </div>
            <div>
              Page {pagination.pageNumber + 1} of {pagination.totalPages}
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        id="delete-modal"
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, uuid: null })}
        onConfirm={() => handleDelete(deleteModal.uuid)}
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
        onClose={() => setSaveModal({ isOpen: false, uuid: null })}
        onConfirm={() => handleUpdate(saveModal.uuid)}
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
