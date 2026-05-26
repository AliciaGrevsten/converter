export type RecordType = "P" | "T" | "A" | "F";

export interface Address {
  street?: string | undefined;
  city?: string | undefined;
  zipcode?: string | undefined;
}

export interface Phone {
  mobile?: string | undefined;
  landline?: string | undefined;
}

export interface FamilyMember {
  name?: string | undefined;
  born?: string | undefined;
  phone?: Phone;
  address?: Address;
}

export interface Person {
  firstname?: string | undefined;
  lastname?: string | undefined;
  phone?: Phone;
  address?: Address;
  family: FamilyMember[];
}
