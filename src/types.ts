export interface Address {
  street?: string;
  city?: string;
  zipcode?: string;
}

export interface Phone {
  mobile?: string;
  landline?: string;
}

export interface FamilyMember {
  name?: string;
  born?: string;
  phone?: Phone;
  address?: Address;
}

export interface Person {
  firstname?: string;
  lastname?: string;
  phone?: Phone;
  address?: Address;
  family: FamilyMember[];
}
