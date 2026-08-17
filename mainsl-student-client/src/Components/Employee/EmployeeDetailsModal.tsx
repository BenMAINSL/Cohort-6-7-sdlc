import type { IPerson } from "../../Models/IPerson";
import PersonDetailsModal from "../Person/PersonDetailsModal";
import { employeeVariant } from "../Person/personVariant";

interface Props {
  employee: IPerson | null;
  onClose: () => void;
  onEdit?: (employee: IPerson) => void;
  onDelete?: (employee: IPerson) => void | Promise<void>;
}

export default function EmployeeDetailsModal({
  employee,
  onClose,
  onEdit,
  onDelete,
}: Props) {
  return (
    <PersonDetailsModal
      person={employee}
      variant={employeeVariant}
      onClose={onClose}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}
