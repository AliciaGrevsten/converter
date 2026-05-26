# converter

A small TypeScript program that converts pipe-delimited records into XML.

## Structure

- `src/converter.ts` contains the full app logic
- `src/assets/input.txt` is the default input file
- `src/assets/output.xml` is the generated output file

## Usage

```bash
npm start
```

This reads `src/assets/input.txt` and writes the XML result to `src/assets/output.xml`.

You can also pass a custom input file path:

```bash
npm start -- path/to/your/input.txt
```

The converter will use the provided file path and always write the XML output to `src/assets/output.xml`.

## Supported records

The parser accepts pipe-delimited records, and **no fields are required**.

- `P` can be followed by zero, one, or two values for `firstname` and `lastname`
- `T` can be followed by zero, one, or two values for `mobile` and `landline`
- `A` can be followed by zero, one, two, or three values for `street`, `city`, and `zipcode`
- `F` can be followed by zero, one, or two values for `name` and `born`
- Unknown record types are rejected
- Empty records are ignored

## Sample files

- `src/assets/input.txt`
- `src/assets/output.xml`

Run the converter against the sample input to regenerate `output.xml`.
