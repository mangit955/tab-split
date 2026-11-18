import "./style.css";
import { computeTab, formatCents, parseBill } from "./tip";

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

    <dl class="summary">
      <div><dt>Tip</dt><dd id="tip-amount">$0.00</dd></div>
      <div class="total"><dt>Total</dt><dd id="total-amount">$0.00</dd></div>
    </dl>
  </section>
`;

const bill = app.querySelector<HTMLInputElement>("#bill");
const billError = app.querySelector<HTMLElement>("#bill-error");
const tipAmount = app.querySelector<HTMLElement>("#tip-amount");
const totalAmount = app.querySelector<HTMLElement>("#total-amount");
const tipButtons = [...app.querySelectorAll<HTMLButtonElement>(".tip")];
if (bill === null || billError === null || tipAmount === null || totalAmount === null) {
  throw new Error("the page is missing one of its fields");
}

let tipPercent: number = 18;

function render(): void {
  for (const button of tipButtons) {
    button.setAttribute("aria-checked", String(Number(button.dataset.percent) === tipPercent));
  }
  const typed = bill?.value ?? "";
  const cents = parseBill(typed);
  if (billError !== null) billError.hidden = typed.trim() === "" || cents !== null;
  const tab = computeTab(cents ?? 0, tipPercent);
  if (tipAmount !== null) tipAmount.textContent = formatCents(tab.tipCents);
  if (totalAmount !== null) totalAmount.textContent = formatCents(tab.totalCents);
}

bill.addEventListener("input", render);
for (const button of tipButtons) {
  button.addEventListener("click", () => {
    tipPercent = Number(button.dataset.percent);
    render();
  });
}
render();
