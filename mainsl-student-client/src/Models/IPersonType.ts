// export interface IPersonType {
//   Student: 0;
//   Employee: 1;
// }export type PersonType = 0 | 1;
export const PersonType = {
  Student: "Student",
  Employee: "Employee",
} as const;

// Creates a TypeScript union type from the values defined in the PersonType object.
export type PersonType = (typeof PersonType)[keyof typeof PersonType];
