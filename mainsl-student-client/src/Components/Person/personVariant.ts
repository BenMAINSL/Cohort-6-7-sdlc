import { PersonType } from "../../Models/IPersonType";

export interface PersonVariant {
  personType: PersonType;
  theme: "green" | "blue";

  detailsTitle: string;
  addTitle: string;
  editTitle: string;
  addSubmitLabel: string;

  //departandprogram
  groupLabel: string;
  groupPlaceholder: string;

  //students
  showCohortAndPhase: boolean;
}

export const studentVariant: PersonVariant = {
  personType: PersonType.Student,
  theme: "green",

  detailsTitle: "Student Details",
  addTitle: "Add Student",
  editTitle: "Edit Student",
  addSubmitLabel: "Add Student",

  groupLabel: "Programme",
  groupPlaceholder: "Programme",

  showCohortAndPhase: true,
};

export const employeeVariant: PersonVariant = {
  personType: PersonType.Employee,
  theme: "blue",

  detailsTitle: "Student Details",
  addTitle: "Add Employee",
  editTitle: "Edit Employee",
  addSubmitLabel: "Add Employee",

  groupLabel: "Department",
  groupPlaceholder: "Department",

  showCohortAndPhase: true,
};
