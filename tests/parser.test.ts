import test from "node:test";
import assert from "node:assert/strict";

import { parseInput } from "../src/parser";
import { buildXml } from "../src/renderXlm";

const sampleInput = `P|Carl Gustaf|Bernadotte
T|0768-101801|08-101801
A|Drottningholms slott|Stockholm|10001
F|Victoria|1977
A|Haga Slott|Stockholm|10002
F|Carl Philip|1979
T|0768-101802|08-101802
P|Barack|Obama
A|1600 Pennsylvania Avenue|Washington, D.C`;

const expectedXml = `<?xml version="1.0" encoding="UTF-8"?>
<people>
<person>
<firstname>Carl Gustaf</firstname>
<lastname>Bernadotte</lastname>
<phone>
<mobile>0768-101801</mobile>
<landline>08-101801</landline>
</phone>
<address>
<street>Drottningholms slott</street>
<city>Stockholm</city>
<zipcode>10001</zipcode>
</address>
<family>
<name>Victoria</name>
<born>1977</born>
<address>
<street>Haga Slott</street>
<city>Stockholm</city>
<zipcode>10002</zipcode>
</address>
</family>
<family>
<name>Carl Philip</name>
<born>1979</born>
<phone>
<mobile>0768-101802</mobile>
<landline>08-101802</landline>
</phone>
</family>
</person>
<person>
<firstname>Barack</firstname>
<lastname>Obama</lastname>
<address>
<street>1600 Pennsylvania Avenue</street>
<city>Washington, D.C</city>
</address>
</person>
</people>
`;

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
            },
            family: [],
        },
    ]);
});

test("buildXml renders the sample input without requiring a zipcode", () => {
    assert.equal(buildXml(parseInput(sampleInput)), expectedXml);
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
