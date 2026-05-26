import { Address, FamilyMember, Person, Phone } from "./types";

function escape(value: string | undefined): string {
  if (!value) return "";
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function tag(name: string, content: string): string {
  return `<${name}>${content}</${name}>\n`;
}

function block(name: string, content: string): string {
  return `<${name}>\n${content}</${name}>\n`;
}

function appendField(xml: string, name: string, value: string | undefined): string {
  if (!value) return xml;
  return xml + tag(name, escape(value));
}

function renderFields(fields: Array<[string, string | undefined]>): string {
  let xml = "";
  for (const [name, value] of fields) {
    xml = appendField(xml, name, value);
  }
  return xml;
}

function renderSection(name: string, fields: Array<[string, string | undefined]>, nested: string[] = []): string {
  let xml = renderFields(fields);
  for (const child of nested) {
    xml += child;
  }
  return block(name, xml);
}

function phoneToXml(phone: Phone): string {
  return renderSection("phone", [
    ["mobile", phone.mobile],
    ["landline", phone.landline],
  ]);
}

function addressToXml(address: Address): string {
  return renderSection("address", [
    ["street", address.street],
    ["city", address.city],
    ["zipcode", address.zipcode],
  ]);
}

function familyToXml(member: FamilyMember): string {
  return renderSection(
    "family",
    [
      ["name", member.name],
      ["born", member.born],
    ],
    [
      member.phone ? phoneToXml(member.phone) : "",
      member.address ? addressToXml(member.address) : "",
    ]
  );
}

function personToXml(person: Person): string {
  return renderSection(
    "person",
    [
      ["firstname", person.firstname],
      ["lastname", person.lastname],
    ],
    [
      person.phone ? phoneToXml(person.phone) : "",
      person.address ? addressToXml(person.address) : "",
      ...person.family.map((member) => familyToXml(member)),
    ]
  );
}

export function buildXml(people: Person[]): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<people>\n`;
  for (const person of people) {
    xml += personToXml(person);
  }
  xml += `</people>\n`;
  return xml;
}
