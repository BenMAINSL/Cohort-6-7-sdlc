import type { IPerson } from "../../Models/IPerson";
import PersonAvatar from "../Person/PersonAvatar";

interface StudentGridProps {
  students: IPerson[];
  onStudentClick: (student: IPerson) => void;
}

const StudentGrid = ({ students, onStudentClick }: StudentGridProps) => {
  return (
    <div className="grid">
      {students.map((student) => (
        <div
          className="card"
          key={student.id}
          onClick={() => onStudentClick(student)}
        >
          <PersonAvatar person={student} className="avatar blue" />

          <div>
            <h3>
              {student.firstName} {student.lastName}
            </h3>

            <span className="badge">{student.departmentOrProgramme}</span>
            <a href={`mailto:${student.email}`}>{student.email}</a>
            <p>{student.gender}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentGrid;
