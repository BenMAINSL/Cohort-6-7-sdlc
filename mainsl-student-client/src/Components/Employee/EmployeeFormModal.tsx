import type { IPerson } from "../../Models/IPerson";
import PersonFormModal from "../Person/PersonFormModal";
import { employeeVariant } from "../Person/personVariant";

interface EmployeeFormModalProps {
  open: boolean;
  mode: "add" | "edit";
  employee?: IPerson | null;

  onClose: () => void;
  onSave: (employee: IPerson, imageFile?: File | null) => void | Promise<void>;
}

export default function EmployeeFormModal({
  open,
  mode,
  employee,
  onClose,
  onSave,
}: EmployeeFormModalProps) {
  return (
    <PersonFormModal
      open={open}
      mode={mode}
      person={employee}
      variant={employeeVariant}
      onClose={onClose}
      onSave={onSave}
    />
  );
}
