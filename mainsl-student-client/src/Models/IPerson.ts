import type { PersonType } from "./IPersonType";

export interface IPerson {
  id: number;
  firstName: string;
  lastName: string;
  personType: PersonType;
  departmentOrProgramme: string;
  gender: string;
  email: string;
  funFact?: string;
  imageUrl?: string;

  /** Students only. */
  cohort?: string;
  /** Students only. */
  phase?: string;
}
