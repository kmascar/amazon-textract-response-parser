import { TextractDocument } from "../src/index";

describe("TextractDocument", () => {
  it("should parse the test JSON without error", () => {
    expect(() => {
      new TextractDocument(require("./data/test-response.json"));
    }).not.toThrowError();
  });

  it("should correctly load pages, lines and words", () => {
    const doc = new TextractDocument(require("./data/test-response.json"));
    expect(doc.pages.length).toStrictEqual(1);
    expect(doc.pages[0].lines.length).toStrictEqual(22);
    expect(doc.pages[0].lines[0].words.length).toStrictEqual(2);
    expect(doc.pages[0].lines.reduce((acc, next) => acc + next.words.length, 0)).toStrictEqual(53);
  });

  it("should correctly load tables", () => {
    const doc = new TextractDocument(require("./data/test-response.json"));
    expect(doc.pages[0].tables.length).toStrictEqual(1);

    const table = doc.pages[0].tables[0];
    expect(table.rows.length).toStrictEqual(5);
    expect(table.rows[1].cells.length).toStrictEqual(5);
    expect(table.rows[1].cells[0].text).toMatch("Start Date");
  });

  it("should correctly load forms", () => {
    const doc = new TextractDocument(require("./data/test-response.json"));
    expect(doc.pages[0].form.fields.length).toStrictEqual(4);
  });

  it("should retrieve form fields by key", () => {
    const doc = new TextractDocument(require("./data/test-response.json"));
    expect(doc.pages[0].form.getFieldByKey("Phone Number:").value?.text).toStrictEqual("555-0100");
  });

  it("should search form fields by key", () => {
    const doc = new TextractDocument(require("./data/test-response.json"));
    //expect(JSON.stringify(doc.pages[0].form.fields.map(f => `${f._key && f._key.text}:${f._value && f._value.text}`).join("||"))).toEqual("Hi");
    const results = doc.pages[0].form.searchFieldsByKey("Home Addr");
    expect(results.length).toStrictEqual(1);
    expect(results[0].value?.text).toMatch("123 Any Street");
  });
});
