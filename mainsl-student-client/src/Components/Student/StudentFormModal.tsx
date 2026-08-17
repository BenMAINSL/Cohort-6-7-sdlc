import type { IPerson } from "../../Models/IPerson";
import PersonFormModal from "../Person/PersonFormModal";
import { studentVariant } from "../Person/personVariant";

interface StudentFormModalProps {
  open: boolean;
  mode: "add" | "edit";
  student?: IPerson | null;

  onClose: () => void;
  onSave: (student: IPerson, imageFile?: File | null) => void | Promise<void>;
}

export default function StudentFormModal({
  open,
  mode,
  student,
  onClose,
  onSave,
}: StudentFormModalProps) {
  return (
    <PersonFormModal
      open={open}
      mode={mode}
      person={student}
      variant={studentVariant}
      onClose={onClose}
      onSave={onSave}
    />
  );
}
