import "./style.css";
import { computePerPerson, computeTab, formatCents, parseBill } from "./tip";

const TIP_CHOICES = [10, 15, 18, 20] as const;

const app = document.querySelector<HTMLElement>("#app");
if (app === null) throw new Error("index.html has no #app");

app.innerHTML = `
  <section class="card">
    <header>
      <h1>Tab Split</h1>
      <p class="subtitle">Work out the tip before the waiter comes back.</p>
    </header>

    <label class="field">
      <span>Bill</span>
      <input id="bill" inputmode="decimal" autocomplete="off" placeholder="$0.00" aria-describedby="bill-error" />
      <small id="bill-error" class="error" hidden>Enter an amount like 42.50</small>
    </label>

    <fieldset class="field">
      <legend>Tip</legend>
      <div class="tips" role="radiogroup" aria-label="Tip">
        ${TIP_CHOICES.map(
          (percent) =>
            `<button type="button" role="radio" class="tip" data-percent="${percent}" aria-checked="false">${percent}%</button>`,
        ).join("")}
      </div>
    </fieldset>

    <div class="field people-field">
      <span id="people-label">People</span>
      <div class="stepper" role="group" aria-labelledby="people-label">
        <button type="button" class="step" id="people-decrease" aria-label="Fewer people">−</button>
        <output id="people-count" aria-live="polite">1</output>
        <button type="button" class="step" id="people-increase" aria-label="More people">+</button>
      </div>
    </div>

    <dl class="summary">
      <div><dt>Tip</dt><dd id="tip-amount">$0.00</dd></div>
      <div class="total"><dt>Total</dt><dd id="total-amount">$0.00</dd></div>
      <div><dt>Each person</dt><dd id="per-person-amount">$0.00</dd></div>
    </dl>
  </section>
`;

const bill = app.querySelector<HTMLInputElement>("#bill");
const billError = app.querySelector<HTMLElement>("#bill-error");
const tipAmount = app.querySelector<HTMLElement>("#tip-amount");
const totalAmount = app.querySelector<HTMLElement>("#total-amount");
const perPersonAmount = app.querySelector<HTMLElement>("#per-person-amount");
const peopleCount = app.querySelector<HTMLOutputElement>("#people-count");
const decreasePeople = app.querySelector<HTMLButtonElement>("#people-decrease");
const increasePeople = app.querySelector<HTMLButtonElement>("#people-increase");
const tipButtons = [...app.querySelectorAll<HTMLButtonElement>(".tip")];
if (
  bill === null ||
  billError === null ||
  tipAmount === null ||
  totalAmount === null ||
  perPersonAmount === null ||
  peopleCount === null ||
  decreasePeople === null ||
  increasePeople === null
) {
  throw new Error("the page is missing one of its fields");
}

let tipPercent: number = 18;
let people = 1;

function render(): void {
  for (const button of tipButtons) {
    button.setAttribute("aria-checked", String(Number(button.dataset.percent) === tipPercent));
  }
  const typed = bill?.value ?? "";
  const cents = parseBill(typed);
  if (billError !== null) billError.hidden = typed.trim() === "" || cents !== null;
  const tab = computeTab(cents ?? 0, tipPercent);
  tipAmount!.textContent = formatCents(tab.tipCents);
  totalAmount!.textContent = formatCents(tab.totalCents);
  perPersonAmount!.textContent = formatCents(computePerPerson(tab.totalCents, people));
  peopleCount!.value = String(people);
  decreasePeople!.disabled = people === 1;
  increasePeople!.disabled = people === 20;
}

bill.addEventListener("input", render);
for (const button of tipButtons) {
  button.addEventListener("click", () => {
    tipPercent = Number(button.dataset.percent);
    render();
  });
}
decreasePeople.addEventListener("click", () => {
  people = Math.max(1, people - 1);
  render();
});
increasePeople.addEventListener("click", () => {
  people = Math.min(20, people + 1);
  render();
});
render();
