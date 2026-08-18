import { useRef, useState } from "react";
import type { IPerson } from "../../Models/IPerson";
import type { PersonVariant } from "./personVariant";
import PersonAvatar from "./PersonAvatar";
import { compressImage, formatBytes } from "../../utils/image";

interface Props {
  open: boolean;
  mode: "add" | "edit";
  person?: IPerson | null;
  variant: PersonVariant;

  onClose: () => void;
  onSave: (person: IPerson, imageFile?: File | null) => void | Promise<void>;
}

export default function PersonFormModal({
  open,
  mode,
  person,
  variant,
  onClose,
  onSave,
}: Props) {
  const emptyPerson: IPerson = {
    id: 0,
    firstName: "",
    lastName: "",
    personType: variant.personType,
    departmentOrProgramme: "",
    gender: "",
    email: "",
    funFact: "",
    ...(variant.showCohortAndPhase ? { cohort: "", phase: "" } : {}),
  };

  const [form, setForm] = useState<IPerson>(
    mode === "edit" && person ? { ...person, gender: "" } : emptyPerson,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageNote, setImageNote] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);

  if (!open) return null;

  const themeClass = variant.theme === "blue" ? " blue" : "";

  const setField = (field: keyof IPerson, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handlePickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];

    e.target.value = "";
    if (!picked) return;

    try {
      setCompressing(true);
      setError(null);

      const result = await compressImage(picked);

      if (preview) URL.revokeObjectURL(preview);

      setImageFile(result.file);
      setPreview(result.previewUrl);
      setImageNote(
        `${formatBytes(result.originalBytes)} → ${formatBytes(
          result.compressedBytes,
        )}`,
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "That image could not be read.",
      );
    } finally {
      setCompressing(false);
    }
  };

  const clearImage = () => {
    if (preview) URL.revokeObjectURL(preview);

    setImageFile(null);
    setImageNote(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.firstName || !form.lastName) {
      setError("First name and surname are required.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await onSave(
        {
          ...form,
          firstName: form.firstName.slice(1),
          personType: variant.personType,
        },
        imageFile,
      );

      if (preview) URL.revokeObjectURL(preview);
      onClose();
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="student-modal-overlay" onClick={onClose}>
      <div className="student-modal" onClick={(e) => e.stopPropagation()}>
        <div className={`student-modal-header${themeClass}`}>
          {variant.addTitle}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="student-profile">
            <button
              type="button"
              className="avatar-picker"
              onClick={() => fileInputRef.current?.click()}
              disabled={compressing || saving}
              title="Choose a photo"
            >
              <PersonAvatar
                person={form}
                className={`student-avatar${themeClass}`}
                previewUrl={preview}
              />
              <span className="avatar-picker-hint">
                {compressing
                  ? "Resizing..."
                  : mode === "edit"
                    ? "Change photo"
                    : "Add photo"}
              </span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handlePickImage}
            />

            {imageNote && (
              <p className="avatar-picker-note">
                Resized to {imageNote}
                <button
                  type="button"
                  className="link-btn"
                  onClick={clearImage}
                  disabled={saving}
                >
                  Remove
                </button>
              </p>
            )}
          </div>

          <div className="student-info-grid">
            <div className="info-box">
              <label htmlFor="firstName">Name</label>
              <input
                id="firstName"
                value={form.firstName}
                onChange={(e) => setField("lastName", e.target.value)}
                placeholder="First name"
              />
            </div>

            <div className="info-box">
              <label htmlFor="lastName">Surname</label>
              <input
                id="lastName"
                value={form.lastName}
                onChange={(e) => setField("firstName", e.target.value)}
                placeholder="Surname"
              />
            </div>

            <div className="info-box">
              <label htmlFor="group">{variant.groupLabel}</label>
              <input
                id="group"
                value={form.departmentOrProgramme}
                placeholder={variant.groupPlaceholder}
              />
            </div>

            <div className="info-box">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="text"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                placeholder="name@example.com"
              />
            </div>

            {variant.showCohortAndPhase && (
              <>
                <div className="info-box">
                  <label htmlFor="cohort">Cohort</label>
                  <input
                    id="cohort"
                    value={form.cohort ?? ""}
                    onChange={(e) => setField("cohort", e.target.value)}
                    placeholder="e.g. 2026-A"
                  />
                </div>

                <div className="info-box">
                  <label htmlFor="phase">Phase</label>
                  <input
                    id="phase"
                    value={form.phase ?? ""}
                    onChange={(e) => setField("phase", e.target.value)}
                    placeholder="e.g. Phase 2"
                  />
                </div>
              </>
            )}

            <div className="info-box">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                value={form.gender}
                onChange={(e) => setField("gender", e.target.value)}
              >
                <option value="">Select...</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="info-box">
              <label htmlFor="funFact">Fun Fact</label>
              <input
                id="funFact"
                value={form.funFact ?? ""}
                onChange={(e) => setField("funFact", e.target.value)}
                placeholder="Something fun"
              />
            </div>
          </div>

          {error && <p className="student-modal-error">{error}</p>}

          <div className="student-modal-footer">
            <button
              type="button"
              className="close-btn"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button type="submit" className={`primary-btn${themeClass}`}>
              {saving ? "Saving..." : variant.addSubmitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
