// @vitest-environment node
import { describe, expect, it } from "vitest";

import { colToRowField, indent, tsTypeFor, type Col } from "@/scripts/db_gen_admin_types";

function col(partial: Partial<Col> & Pick<Col, "column_name" | "data_type" | "udt_name">): Col {
  return {
    is_nullable: "NO",
    column_default: null,
    is_identity: "NO",
    ...partial,
  };
}

describe("db_gen_admin_types (name-mirror)", () => {
  it("maps postgres column types to TypeScript", () => {
    expect(tsTypeFor(col({ column_name: "id", data_type: "uuid", udt_name: "uuid" }))).toBe(
      "string",
    );
    expect(
      tsTypeFor(col({ column_name: "n", data_type: "integer", udt_name: "int4" })),
    ).toBe("number");
    expect(
      tsTypeFor(col({ column_name: "ok", data_type: "boolean", udt_name: "bool" })),
    ).toBe("boolean");
    expect(
      tsTypeFor(col({ column_name: "meta", data_type: "jsonb", udt_name: "jsonb" })),
    ).toBe("Json");
    expect(
      tsTypeFor(col({ column_name: "tags", data_type: "ARRAY", udt_name: "_text" })),
    ).toBe("string[]");
    expect(
      tsTypeFor(
        col({
          column_name: "created",
          data_type: "timestamp with time zone",
          udt_name: "timestamptz",
        }),
      ),
    ).toBe("string");
  });

  it("indents multi-line blocks", () => {
    expect(indent("a\nb", 2)).toBe("  a\n  b");
  });

  it("formats nullable row fields", () => {
    expect(
      colToRowField(
        col({
          column_name: "name",
          data_type: "text",
          udt_name: "text",
          is_nullable: "YES",
        }),
      ),
    ).toBe("          name: string | null");
    expect(
      colToRowField(
        col({
          column_name: "id",
          data_type: "uuid",
          udt_name: "uuid",
          is_nullable: "NO",
        }),
      ),
    ).toBe("          id: string");
  });
});
