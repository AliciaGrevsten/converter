import { Address, FamilyMember, Person, Phone, RecordType } from "./types";


export function parseInput(input: string): Person[] {
  const people: Person[] = [];
  let currentPerson: Person | undefined;
  let currentFamily: FamilyMember | undefined;

  for (const line of input.split(/\r?\n/).map((value) => value.trim()).filter(Boolean)) {
    const [rawType, ...rawValues] = line.split("|");
    const type = rawType?.trim();
    const values = rawValues.map((value) => value.trim());

    if (!type || !isRecordType(type)) {
      throw new Error(`Unsupported record type: ${type ?? ""}`);
    }

    switch (type) {
      case "P": {
        currentPerson = buildPerson(values);
        currentFamily = undefined;
        people.push(currentPerson);
        break;
      }

      case "F": {
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
        const phone = buildPhone(values);
        if (!phone) {
          break;
        }
        if (!currentPerson && !currentFamily) {
          throw new Error("Invalid T record: missing parent person");
        }
        if (currentFamily) {
          attachPhone(currentFamily, phone);
        } else {
          attachPhone(currentPerson!, phone);
        }
        break;
      }

      case "A": {
        const address = buildAddress(values);
        if (!address) {
          break;
        }
        if (!currentPerson && !currentFamily) {
          throw new Error("Invalid A record: missing parent person");
        }
        if (currentFamily) {
          attachAddress(currentFamily, address);
        } else {
          attachAddress(currentPerson!, address);
        }
        break;
      }
    }
  }

  return people;
}

function buildPerson(values: string[]): Person {
  const [firstname, lastname] = values.map(normalize);
  return { firstname, lastname, family: [] };
}

function buildFamily(values: string[]): FamilyMember | undefined {
  const [name, born] = values.map(normalize);

  if (!name && !born) {
    return undefined;
  }

  return {
    ...(name ? { name } : {}),
    ...(born ? { born } : {}),
  };
}

function buildPhone(values: string[]): Phone | undefined {
  const [mobile, landline] = values.map(normalize);

  if (!mobile && !landline) {
    return undefined;
  }

  return {
    ...(mobile ? { mobile } : {}),
    ...(landline ? { landline } : {}),
  };
}

function buildAddress(values: string[]): Address | undefined {
  const [street, city, zipcode] = values.map(normalize);

  if (!street && !city && !zipcode) {
    return undefined;
  }

  return {
    ...(street ? { street } : {}),
    ...(city ? { city } : {}),
    ...(zipcode ? { zipcode } : {}),
  };
}

function attachPhone(target: Person | FamilyMember, phone: Phone): void {
  target.phone = phone;
}

function attachAddress(target: Person | FamilyMember, address: Address): void {
  target.address = address;
}

function isRecordType(value: string): value is RecordType {
  return value === "P" || value === "T" || value === "A" || value === "F";
}

function normalize(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}
