import * as fs from "fs";
import * as path from "path";
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

function tag(name: string, content: string, indent: string): string {
  return `${indent}<${name}>${content}</${name}>\n`;
}

function phoneToXml(phone: Phone, indent: string): string {
  let xml = `${indent}<phone>\n`;
  if (phone.mobile) xml += tag("mobile", escape(phone.mobile), indent + "  ");
  if (phone.landline) xml += tag("landline", escape(phone.landline), indent + "  ");
  xml += `${indent}</phone>\n`;
  return xml;
}

function addressToXml(address: Address, indent: string): string {
  let xml = `${indent}<address>\n`;
  if (address.street) xml += tag("street", escape(address.street), indent + "  ");
  if (address.city) xml += tag("city", escape(address.city), indent + "  ");
  if (address.zipcode) xml += tag("zipcode", escape(address.zipcode), indent + "  ");
  xml += `${indent}</address>\n`;
  return xml;
}

function familyToXml(member: FamilyMember, indent: string): string {
  let xml = `${indent}<family>\n`;
  if (member.name) xml += tag("name", escape(member.name), indent + "  ");
  if (member.born) xml += tag("born", escape(member.born), indent + "  ");
  if (member.phone) xml += phoneToXml(member.phone, indent + "  ");
  if (member.address) xml += addressToXml(member.address, indent + "  ");
  xml += `${indent}</family>\n`;
  return xml;
}

function personToXml(person: Person, indent: string): string {
  let xml = `${indent}<person>\n`;
  if (person.firstname) xml += tag("firstname", escape(person.firstname), indent + "  ");
  if (person.lastname) xml += tag("lastname", escape(person.lastname), indent + "  ");
  if (person.phone) xml += phoneToXml(person.phone, indent + "  ");
  if (person.address) xml += addressToXml(person.address, indent + "  ");
  for (const member of person.family) {
    xml += familyToXml(member, indent + "  ");
  }
  xml += `${indent}</person>\n`;
  return xml;
}

function buildXml(people: Person[]): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<people>\n`;
  for (const person of people) {
    xml += personToXml(person, "  ");
  }
  xml += `</people>\n`;
  return xml;
}

function parseInput(input: string): Person[] {
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

function convert(): void {
  const rawInputPath = process.argv[2];
  const inputPath = rawInputPath
    ? path.resolve(process.cwd(), rawInputPath)
    : path.join(process.cwd(), "src", "assets", "input.txt");
  const outputPath = path.join(process.cwd(), "src", "assets", "output.xml");

  const input = fs.readFileSync(inputPath, "utf-8");
  const xml = buildXml(parseInput(input));

  fs.writeFileSync(outputPath, xml, "utf-8");
  console.log("File converted to XML. See output.xml under assets.");
}

if (require.main === module) {
  convert();
}