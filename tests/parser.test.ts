import test from "node:test";
import assert from "node:assert/strict";

import { parseInput } from "../src/parser";

const sampleInput = `P|Carl Gustaf|Bernadotte
T|0768-101801|08-101801
A|Drottningholms slott|Stockholm|10001
F|Victoria|1977
A|Haga Slott|Stockholm|10002
F|Carl Philip|1979
T|0768-101802|08-101802
P|Barack|Obama
A|1600 Pennsylvania Avenue|Washington, D.C|20001`;

test("parseInput parses the sample input into the expected structure", () => {
  assert.deepStrictEqual(parseInput(sampleInput), [
    {
      firstname: "Carl Gustaf",
      lastname: "Bernadotte",
      phone: {
        mobile: "0768-101801",
        landline: "08-101801",
      },
      address: {
        street: "Drottningholms slott",
        city: "Stockholm",
        zipcode: "10001",
      },
      family: [
        {
          name: "Victoria",
          born: "1977",
          address: {
            street: "Haga Slott",
            city: "Stockholm",
            zipcode: "10002",
          },
        },
        {
          name: "Carl Philip",
          born: "1979",
          phone: {
            mobile: "0768-101802",
            landline: "08-101802",
          },
        },
      ],
    },
    {
      firstname: "Barack",
      lastname: "Obama",
      address: {
        street: "1600 Pennsylvania Avenue",
        city: "Washington, D.C",
        zipcode: "20001",
      },
      family: [],
    },
  ]);
});

test("parseInput rejects unknown record types", () => {
  assert.throws(() => parseInput("X|invalid"), /Unsupported record type/);
});

test("parseInput allows records with no required fields", () => {
  assert.deepStrictEqual(parseInput("P"), [
    {
      firstname: undefined,
      lastname: undefined,
      family: [],
    },
  ]);

  assert.deepStrictEqual(parseInput("T"), []);
  assert.deepStrictEqual(parseInput("A"), []);
  assert.deepStrictEqual(parseInput("F"), []);
});

test("parseInput allows partial phone and address records", () => {
  assert.deepStrictEqual(
    parseInput(`P|Jane|Doe
T|0768-999999
A|Main Street|Stockholm`),
    [
      {
        firstname: "Jane",
        lastname: "Doe",
        phone: {
          mobile: "0768-999999",
        },
        address: {
          street: "Main Street",
          city: "Stockholm",
        },
        family: [],
      },
    ]
  );
});
