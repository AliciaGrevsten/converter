import { Address, FamilyMember, Person, Phone } from "../types";

export function buildXml(people: Person[]): string {
  const peopleXml = people.map((person) => renderPerson(person)).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<people>\n${peopleXml}</people>\n`;
}

function renderPerson(person: Person): string {
  const nestedChildren = [
    person.phone ? renderPhone(person.phone) : undefined,
    person.address ? renderAddress(person.address) : undefined,
    ...person.family.map((member) => renderFamilyMember(member)),
  ].filter((child): child is string => Boolean(child));

  return renderSection(
    "person",
    [
      ["firstname", person.firstname],
      ["lastname", person.lastname],
    ],
    nestedChildren
  );
}

function renderPhone(phone: Phone): string {
  return renderSection("phone", [
    ["mobile", phone.mobile],
    ["landline", phone.landline],
  ]);
}

function renderAddress(address: Address): string {
  return renderSection("address", [
    ["street", address.street],
    ["city", address.city],
    ["zipcode", address.zipcode],
  ]);
}

function renderFamilyMember(member: FamilyMember): string {
  const nestedChildren = [
    member.phone ? renderPhone(member.phone) : undefined,
    member.address ? renderAddress(member.address) : undefined,
  ].filter((child): child is string => Boolean(child));

  return renderSection(
    "family",
    [
      ["name", member.name],
      ["born", member.born],
    ],
    nestedChildren
  );
}

function renderSection(name: string, fields: ReadonlyArray<[string, string | undefined]>, nestedChildren: string[] = []): string {
  const children = [...fields.map(([fieldName, value]) => renderField(fieldName, value)), ...nestedChildren].filter(Boolean);

  return renderContainer(name, children);
}

function renderContainer(name: string, children: string[]): string {
  return `<${name}>\n${children.join("")}</${name}>\n`;
}

function renderField(name: string, value: string | undefined): string {
  return value ? renderElement(name, value) : "";
}

function renderElement(name: string, value: string): string {
  return `<${name}>${escapeXml(value)}</${name}>\n`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
