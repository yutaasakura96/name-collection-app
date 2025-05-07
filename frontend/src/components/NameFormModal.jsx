import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import apiService from "@/services/apiService";
import { validateName, validateNameForm } from "@/utils/validation";
import RequirePermission from "@/components/common/RequirePermission";

const NameFormModal = ({ onNameAdded }) => {
  const { token, hasPermission } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    firstName: "",
    lastName: "",
  });

  // Reset form on successful submission
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
        document.getElementById("name-form-modal").close();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check permissions first
    if (!hasPermission("create:names")) {
      setError("You don't have permission to add names.");
      return;
    }

    const validationResult = validateNameForm(firstName, lastName);
    setValidationErrors({
      firstName: validationResult.firstName,
      lastName: validationResult.lastName,
    });

    if (!validationResult.isValid) {
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const newName = await apiService.addName(firstName, lastName, token);
      setSuccess(true);
      setFirstName("");
      setLastName("");

      if (onNameAdded) {
        onNameAdded(newName);
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setError("You don't have permission to add names. Please contact your administrator.");
      } else {
        setError(error.message || "Failed to submit name. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFirstName("");
    setLastName("");
    setError("");
    setSuccess(false);
    setValidationErrors({ firstName: "", lastName: "" });
    document.getElementById("name-form-modal").close();
  };

  return (
    <RequirePermission
      permission="create:names"
      fallback={
        <dialog id="name-form-modal" className="modal">
          <div className="modal-box max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center text-base-content">Access Denied</h2>
            <p className="mb-4">
              You do not have permission to add new names. Please contact your administrator if you
              believe this is an error.
            </p>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn btn-primary">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      }
    >
      <dialog id="name-form-modal" className="modal">
        <div className="modal-box max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-base-content">Add New Name</h2>

          {error && (
            <div className="alert alert-error mb-4">
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

          {success && (
            <div className="alert alert-success mb-4">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Name submitted successfully!</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-control w-full mb-5">
              <label className="label">
                <span className="label-text text-base-content font-semibold mb-2">First Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter first name"
                className={`input input-bordered w-full bg-base-200 text-base-content ${
                  validationErrors.firstName ? "input-error" : ""
                }`}
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setValidationErrors((prev) => ({
                    ...prev,
                    firstName: validateName(e.target.value, "First name"),
                  }));
                }}
              />
              {validationErrors.firstName && (
                <label className="label">
                  <span className="label-text-alt text-error">{validationErrors.firstName}</span>
                </label>
              )}
            </div>

            <div className="form-control w-full mb-8">
              <label className="label">
                <span className="label-text text-base-content font-semibold mb-2">Last Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter last name"
                className={`input input-bordered w-full bg-base-200 text-base-content ${
                  validationErrors.lastName ? "input-error" : ""
                }`}
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  setValidationErrors((prev) => ({
                    ...prev,
                    lastName: validateName(e.target.value, "Last name"),
                  }));
                }}
              />
              {validationErrors.lastName && (
                <label className="label">
                  <span className="label-text-alt text-error">{validationErrors.lastName}</span>
                </label>
              )}
            </div>

            <div className="modal-action">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`btn btn-primary ${isSubmitting ? "loading" : ""}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop" onSubmit={handleClose}>
          <button>close</button>
        </form>
      </dialog>
    </RequirePermission>
  );
};

export default NameFormModal;
