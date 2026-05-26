import { FamilyMember, Person } from "./types";

export function parseInput(input: string): Person[] {
  const lines = input
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const people: Person[] = [];
  let currentPerson: Person | null = null;
  let currentFamily: FamilyMember | null = null;

  for (const line of lines) {
    const [type, ...values] = line.split("|");

    switch (type) {
      case "P":
        currentPerson = {
          firstname: values[0],
          lastname: values[1],
          family: [],
        };
        people.push(currentPerson);
        currentFamily = null;
        break;

      case "F":
        if (!currentPerson) break;
        currentFamily = {
          name: values[0],
          born: values[1],
        };
        currentPerson.family.push(currentFamily);
        break;

      case "T":
        const phone = { mobile: values[0], landline: values[1] };
        if (currentFamily) currentFamily.phone = phone;
        else if (currentPerson) currentPerson.phone = phone;
        break;

      case "A":
        const address = {
          street: values[0],
          city: values[1],
          zipcode: values[2],
        };
        if (currentFamily) currentFamily.address = address;
        else if (currentPerson) currentPerson.address = address;
        break;
    }
  }

  return people;
}
