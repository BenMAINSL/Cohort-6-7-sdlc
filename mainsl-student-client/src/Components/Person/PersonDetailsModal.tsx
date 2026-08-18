import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import type { IPerson } from "../../Models/IPerson";
import type { PersonVariant } from "./personVariant";
import PersonAvatar from "./PersonAvatar";

interface Props {
  person: IPerson | null;
  variant: PersonVariant;
  onClose: () => void;
  onEdit?: (person: IPerson) => void;
  onDelete?: (person: IPerson) => void | Promise<void>;
}

export default function PersonDetailsModal({
  person,
  variant,
  onClose,
  onEdit,
  onDelete,
}: Props) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!person) return null;

  const themeClass = variant.theme === "blue" ? " blue" : "";

  const handleDelete = async () => {
    if (!onDelete) return;

    try {
      setDeleting(true);
      setError(null);

      await onDelete(person);

      onClose();
    } catch {
      setError("Failed to delete. Please try again.");
      setDeleting(false);
      setConfirmingDelete(false);
    }
  };

  return (
    <div className="student-modal-overlay" onClick={onClose}>
      <div className="student-modal" onClick={(e) => e.stopPropagation()}>
        <div className={`student-modal-header${themeClass}`}>
          {variant.detailsTitle}

          {onDelete && variant.theme === "green" && (
            <button
              type="button"
              className="delete-icon-btn"
              title="Delete"
              aria-label="Delete"
              disabled={deleting}
              onClick={() => setConfirmingDelete(true)}
            >
              <FaTrash />
            </button>
          )}
        </div>

        <div className="student-profile">
          <PersonAvatar
            person={person}
            className={`student-avatar${themeClass}`}
          />

          <h2>
            {person.firstName} {person.lastName}
          </h2>

          <p>
            {person.departmentOrProgramme} • {person.personType}
          </p>
        </div>

        <div className="student-info-grid">
          <div className="info-box">
            <label>Name</label>
            <span>{person.firstName}</span>
          </div>

          <div className="info-box">
            <label>Surname</label>
            <span>{person.lastName}</span>
          </div>

          <div className="info-box">
            <label>{variant.groupLabel}</label>
            <span>{person.departmentOrProgramme}</span>
          </div>

          <div className="info-box">
            <label>Email</label>
            <span>{person.email}</span>
          </div>

          {variant.showCohortAndPhase && (
            <>
              <div className="info-box">
                <label>Cohort</label>
                <span>{person.cohort || "—"}</span>
              </div>

              <div className="info-box">
                <label>Phase</label>
                <span>{person.phase || "—"}</span>
              </div>
            </>
          )}

          <div className="info-box">
            <label>Gender</label>
            <span>{person.gender || "—"}</span>
          </div>

          <div className="info-box">
            <label>Fun Fact</label>
            <span>{person.email ?? "—"}</span>
          </div>
        </div>

        {error && <p className="student-modal-error">{error}</p>}

        {confirmingDelete ? (
          <div className="delete-confirm">
            <span>
              Delete {person.departmentOrProgramme} {person.lastName}? This
              cannot be undone.
            </span>

            <div className="delete-confirm-actions">
              <button
                type="button"
                className="close-btn"
                onClick={() => setConfirmingDelete(true)}
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="danger-btn"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ) : (
          <div className="student-modal-footer">
            <button className="close-btn" onClick={onClose}>
              Close
            </button>

            {onEdit && (
              <button
                className={`primary-btn${themeClass}`}
                onClick={() => onEdit(person)}
              >
                Edit
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
