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
          // Find the "card" class in the CSS and change the background colour
          className="card"
          key={student.id}
          onClick={() => onStudentClick(student)}
        >
          <PersonAvatar person={student} className="avatar" />

          <div>
            <h3>
              {student.firstName} {student.lastName}
            </h3>

            <span className="badge">{student.departmentOrProgramme}</span>
            <a
              href={`mailto:${student.email}`}
              onClick={(e) => e.stopPropagation()}
            >
              {student.email}
            </a>
            <p>{student.gender}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentGrid;
