# Narrowing

Control flow refines types. Inside the typeof check, id is string; after it, number. The discriminated union (kind: "circle" | "square") is the pattern behind most real-world narrowing — switch on kind and every case gets the right shape.
