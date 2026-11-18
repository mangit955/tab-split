/** What a bill comes to once the tip is added, in cents so nothing is lost to floating point. */
export interface Tab {
  tipCents: number;
  totalCents: number;
}

/** Reads what someone typed as a bill ("42", "42.5", "$42.50") as cents, or null if it isn't one. */
export function parseBill(input: string): number | null {
  const cleaned = input.trim().replace(/^\$/, "");
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;
  return Math.round(Number(cleaned) * 100);
}

/** The tip and total for a bill, with the tip rounded to the nearest cent. */
export function computeTab(billCents: number, tipPercent: number): Tab {
  const tipCents = Math.round((billCents * tipPercent) / 100);
  return { tipCents, totalCents: billCents + tipCents };
}

/** The amount each person pays, rounded up so the group always covers the total. */
export function computePerPerson(totalCents: number, people: number): number {
  return Math.ceil(totalCents / people);
}

/** Cents as dollars, the way a receipt prints them. */
export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
