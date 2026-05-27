import test from "node:test";
import assert from "node:assert/strict";

import { parseInput } from "../parser/parser";
import { buildXml } from "./render-xml";

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

test("buildXml renders the sample input", () => {
  assert.equal(buildXml(parseInput(sampleInput)), expectedXml);
});

test("buildXml escapes XML special characters", () => {
  const xml = buildXml([
    {
      firstname: "A&B",
      lastname: "C<D",
      family: [],
    },
  ]);

  assert.equal(
    xml,
    `<?xml version="1.0" encoding="UTF-8"?>
<people>
<person>
<firstname>A&amp;B</firstname>
<lastname>C&lt;D</lastname>
</person>
</people>
`
  );
});
