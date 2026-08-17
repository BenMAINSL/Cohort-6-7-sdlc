import type { IPerson } from "../../Models/IPerson";
import PersonDetailsModal from "../Person/PersonDetailsModal";
import { studentVariant } from "../Person/personVariant";

interface Props {
  student: IPerson | null;
  onClose: () => void;
  onEdit?: (student: IPerson) => void;
  onDelete?: (student: IPerson) => void | Promise<void>;
}

export default function StudentDetailsModal({
  student,
  onClose,
  onEdit,
  onDelete,
}: Props) {
  return (
    <PersonDetailsModal
      person={student}
      variant={studentVariant}
      onClose={onClose}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}
