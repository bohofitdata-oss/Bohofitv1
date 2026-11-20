import { test } from "node:test";
import assert from "node:assert/strict";
import { joinWhatsAppLink, trialRequestSchema } from "./join-request";
import { PEOPLE_TRAINED } from "./site-facts";

test("training count is 2700+", () => assert.equal(PEOPLE_TRAINED, "2,700+ people trained since 2022"));
test("joining backup sends customer details to 8100 265630", () => {
  const url = new URL(joinWhatsAppLink({ name: "Test Member", phone: "8100265630", email: "test@example.com", age: 32, city: "Bengaluru", goal: "Build strength" }));
  assert.equal(url.pathname, "/918100265630");
  assert.ok(url.searchParams.get("text")?.includes("Name: Test Member"));
  assert.ok(url.searchParams.get("text")?.includes("Email: test@example.com"));
});
test("intake cannot accept invalid contact data", () => assert.equal(trialRequestSchema.safeParse({name:"", email:"bad"}).success, false));