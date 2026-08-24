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
          // Find the "card" class in the CSS and change the background colour and other styles to make it match the wireframe design. You can also add hover effects and transitions to make it more interactive.
          className="card"
          key={employee.id}
          onClick={() => onEmployeeClick(employee)}
        >
          <PersonAvatar person={employee} className="avatar blue" />

          <div>
            {/* Adjust the header size to an appropriate size to match the wireframe design */}
            <h6>
              {employee.firstName} {employee.lastName}
            </h6>

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
