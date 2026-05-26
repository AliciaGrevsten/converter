import { Address, FamilyMember, Person, Phone } from "./types";

type RecordType = "P" | "T" | "A" | "F";

function isRecordType(value: string): value is RecordType {
  return value === "P" || value === "T" || value === "A" || value === "F";
}

function validateFieldCount(values: string[], maxLength: number, recordType: RecordType): void {
  if (values.length > maxLength) {
    throw new Error(`Invalid ${recordType} record: too many fields`);
  }
}

function toOptionalFields(values: string[]): Array<string | undefined> {
  return values.map((value) => {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  });
}

function buildPhone(values: string[]): Phone | undefined {
  const [mobile, landline] = toOptionalFields(values);
  const phone: Phone = {};

  if (mobile) {
    phone.mobile = mobile;
  }

  if (landline) {
    phone.landline = landline;
  }

  return Object.keys(phone).length > 0 ? phone : undefined;
}

function buildAddress(values: string[]): Address | undefined {
  const [street, city, zipcode] = toOptionalFields(values);
  const address: Address = {};

  if (street) {
    address.street = street;
  }

  if (city) {
    address.city = city;
  }

  if (zipcode) {
    address.zipcode = zipcode;
  }

  return Object.keys(address).length > 0 ? address : undefined;
}

function buildFamily(values: string[]): FamilyMember | undefined {
  const [name, born] = toOptionalFields(values);

  if (!name && !born) {
    return undefined;
  }

  return {
    name,
    born,
  };
}

function buildPerson(values: string[]): Person {
  const [firstname, lastname] = toOptionalFields(values);
  return {
    firstname,
    lastname,
    family: [],
  };
}

export function parseInput(input: string): Person[] {
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const people: Person[] = [];
  let currentPerson: Person | null = null;
  let currentFamily: FamilyMember | null = null;

  for (const line of lines) {
    const [rawType, ...rawValues] = line.split("|");
    const type = rawType?.trim();
    const values = rawValues.map((value) => value.trim());

    if (!type || !isRecordType(type)) {
      throw new Error(`Unsupported record type: ${type ?? ""}`);
    }

    switch (type) {
      case "P": {
        validateFieldCount(values, 2, type);
        const person = buildPerson(values);
        currentPerson = person;
        currentFamily = null;
        people.push(person);
        break;
      }

      case "F": {
        validateFieldCount(values, 2, type);
        const family = buildFamily(values);

        if (!family) {
          break;
        }

        if (!currentPerson) {
          throw new Error("Invalid F record: missing parent person");
        }

        currentFamily = family;
        currentPerson.family.push(family);
        break;
      }

      case "T": {
        validateFieldCount(values, 2, type);
        const phone = buildPhone(values);

        if (!phone) {
          break;
        }

        if (currentFamily) {
          currentFamily.phone = phone;
        } else if (currentPerson) {
          currentPerson.phone = phone;
        } else {
          throw new Error("Invalid T record: missing parent person");
        }
        break;
      }

      case "A": {
        validateFieldCount(values, 3, type);
        const address = buildAddress(values);

        if (!address) {
          break;
        }

        if (currentFamily) {
          currentFamily.address = address;
        } else if (currentPerson) {
          currentPerson.address = address;
        } else {
          throw new Error("Invalid A record: missing parent person");
        }
        break;
      }
    }
  }

  return people;
}
