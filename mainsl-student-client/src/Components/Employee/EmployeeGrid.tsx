import type { IPerson } from "../../Models/IPerson";
import PersonAvatar from "../Person/PersonAvatar";

interface EmployeeGridProps {
  employee: IPerson[];
  onEmployeeClick: (employee: IPerson) => void;
}

const EmployeeGrid = ({ employee, onEmployeeClick }: EmployeeGridProps) => {
  return (
    <div className="grid">
      {employee.map((employee) => (
        <div
          // Find the "card" class in the CSS and change the background colour here
          className="card"
          key={employee.id}
          onClick={() => onEmployeeClick(employee)}
        >
          <PersonAvatar person={employee} className="avatar blue" />

          <div>
            {/* Adjust the header size to an appropriate size */}
            <h3>
              {employee.firstName} {employee.lastName}
            </h3>

            <span className="badgeEmployee">
              {employee.departmentOrProgramme}
            </span>

            <a
              href={`mailto:${employee.email}`}
              onClick={(e) => e.stopPropagation()}
            >
              {employee.email}
            </a>

            <p>{employee.gender}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmployeeGrid;
