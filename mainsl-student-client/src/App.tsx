import { useMemo, useState } from "react";
import { FaSearch, FaGraduationCap, FaBriefcase, FaPlus } from "react-icons/fa";
import "./styles/home.css";
import type { IPerson } from "./Models/IPerson";
import { PersonType } from "./Models/IPersonType";
import { usePeople } from "./hooks/usePeople";
import StudentGrid from "./Components/Student/StudentGrid";
import StudentDetailsModal from "./Components/Student/StudentDetailsModal";
import StudentFormModal from "./Components/Student/StudentFormModal";
import EmployeeGrid from "./Components/Employee/EmployeeGrid";
import EmployeeDetailsModal from "./Components/Employee/EmployeeDetailsModal";
import EmployeeFormModal from "./Components/Employee/EmployeeFormModal";

export default function Home() {
  const [search, setSearch] = useState("");

  const [selectedStudent, setSelectedStudent] = useState<IPerson | null>(null);
  const [studentFormOpen, setStudentFormOpen] = useState(false);
  const [studentFormMode, setStudentFormMode] = useState<"add" | "edit">("add");
  const [studentBeingEdited, setStudentBeingEdited] = useState<IPerson | null>(
    null,
  );

  const [selectedEmployee, setSelectedEmployee] = useState<IPerson | null>(
    null,
  );
  const [employeeFormOpen, setEmployeeFormOpen] = useState(false);
  const [employeeFormMode, setEmployeeFormMode] = useState<"add" | "edit">(
    "add",
  );
  const [employeeBeingEdited, setEmployeeBeingEdited] =
    useState<IPerson | null>(null);

  const {
    people: students,
    loading: studentsLoading,
    error: studentsError,
    addPerson: addStudent,
    updatePerson: updateStudent,
    deletePerson: deleteStudent,
    uploadImage: uploadStudentImage,
  } = usePeople(PersonType.Student);

  const {
    people: employees,
    loading: employeesLoading,
    error: employeesError,
    addPerson: addEmployee,
    updatePerson: updateEmployee,
    deletePerson: deleteEmployee,
    uploadImage: uploadEmployeeImage,
  } = usePeople(PersonType.Employee);

  const filteredStudents = useMemo(() => {
    return students.filter((p) =>
      `${p.firstName} ${p.lastName} ${p.departmentOrProgramme}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [students, search]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((p) =>
      `${p.firstName} ${p.lastName} ${p.departmentOrProgramme} ${p.email}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [employees, search]);

  const openAddStudent = () => {
    setStudentFormMode("add");
    setStudentBeingEdited(null);
    setStudentFormOpen(true);
  };

  const openEditStudent = (student: IPerson) => {
    setStudentFormMode("edit");
    setStudentBeingEdited(student);
    setSelectedStudent(null);
    setStudentFormOpen(true);
  };

  const handleSaveStudent = async (
    student: IPerson,
    imageFile?: File | null,
  ) => {
    if (studentFormMode === "edit") {
      await updateStudent(student);
      if (imageFile) await uploadStudentImage(student.id, imageFile);
    } else {
      // The image endpoint is keyed on id, so the record has to exist first.
      const created = await addStudent(student);
      if (imageFile && created?.id) {
        await uploadStudentImage(created.id, imageFile);
      }
    }
  };

  const handleDeleteStudent = async (student: IPerson) => {
    await deleteStudent(student.id);
  };

  const openAddEmployee = () => {
    setEmployeeFormMode("add");
    setEmployeeBeingEdited(null);
    setEmployeeFormOpen(true);
  };

  const openEditEmployee = (employee: IPerson) => {
    setEmployeeFormMode("edit");
    setEmployeeBeingEdited(employee);
    setSelectedEmployee(null); // swap the details modal out for the form
    setEmployeeFormOpen(true);
  };

  const handleSaveEmployee = async (
    employee: IPerson,
    imageFile?: File | null,
  ) => {
    if (employeeFormMode === "edit") {
      await updateEmployee(employee);
      if (imageFile) await uploadEmployeeImage(employee.id, imageFile);
    } else {
      // The image endpoint is keyed on id, so the record has to exist first.
      const created = await addEmployee(employee);
      if (imageFile && created?.id) {
        await uploadEmployeeImage(created.id, imageFile);
      }
    }
  };

  const handleDeleteEmployee = async (employee: IPerson) => {
    await deleteEmployee(employee.id);
  };

  if (studentsLoading || employeesLoading) {
    return <div>Loading...</div>;
  }

  if (studentsError || employeesError) {
    return <div>{studentsError || employeesError}</div>;
  }

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1>SDLC Workshop Directory</h1>
          <p>Students & Employees</p>
        </div>

        <span>Powered by Mains'l</span>
      </header>

      <div className="search">
        <FaSearch />

        <input
          placeholder="Search by name, cohort, role or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <section className="section students">
        <div className="sectionHeader">
          <div>
            <FaGraduationCap />
            <h2>Students ({filteredStudents.length})</h2>
          </div>

          <button onClick={openAddStudent}>
            <FaPlus />
            Add Student
          </button>
        </div>
        <StudentGrid
          students={filteredStudents}
          onStudentClick={setSelectedStudent}
        />
      </section>

      <section className="section employees">
        <div className="sectionHeader">
          <div>
            <FaBriefcase />
            <h2>Employees ({filteredEmployees.length})</h2>
          </div>

          <button onClick={openAddEmployee}>
            <FaPlus />
            Add Employee
          </button>
        </div>
        <EmployeeGrid
          employee={filteredEmployees}
          onEmployeeClick={setSelectedEmployee}
        />
      </section>

      <StudentDetailsModal
        key={`student-details-${selectedStudent?.id ?? "none"}`}
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onEdit={openEditStudent}
        onDelete={handleDeleteStudent}
      />

      <StudentFormModal
        key={
          studentFormOpen
            ? `${studentFormMode}-${studentBeingEdited?.id ?? "new"}`
            : "closed"
        }
        open={studentFormOpen}
        mode={studentFormMode}
        student={studentBeingEdited}
        onClose={() => setStudentFormOpen(false)}
        onSave={handleSaveStudent}
      />

      <EmployeeDetailsModal
        key={`employee-details-${selectedEmployee?.id ?? "none"}`}
        employee={selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        onEdit={openEditEmployee}
        onDelete={handleDeleteEmployee}
      />

      <EmployeeFormModal
        key={
          employeeFormOpen
            ? `${employeeFormMode}-${employeeBeingEdited?.id ?? "new"}`
            : "closed"
        }
        open={employeeFormOpen}
        mode={employeeFormMode}
        employee={employeeBeingEdited}
        onClose={() => setEmployeeFormOpen(false)}
        onSave={handleSaveEmployee}
      />
    </div>
  );
}
