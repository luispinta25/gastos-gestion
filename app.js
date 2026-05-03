const SUPABASE_URL = "https://lpsupabase.luispintasolutions.com";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzE1MDUwODAwLAogICJleHAiOiAxODcyODE3MjAwCn0.LJEZ3yyGRxLBmCKM9z3EW-Yla1SszwbmvQMngMe3IWA";

const TABLES = {
  profiles: "gastos_gestion_profiles",
  reminders: "gastos_gestion_reminders",
  fixedExpenses: "gastos_gestion_fixed_expenses",
  debts: "gastos_gestion_debts",
  debtPayments: "gastos_gestion_debt_payments",
  debtInstallments: "gastos_gestion_debt_installments",
  monthlyDebtEntries: "gastos_gestion_monthly_debt_entries",
  savingsGoals: "gastos_gestion_savings_goals",
  savingsContributions: "gastos_gestion_savings_contributions",
  birthdays: "gastos_gestion_birthdays",
};

const FONTS = [
  { value: "Inter",             label: "Inter",             family: "Inter, ui-sans-serif, system-ui, sans-serif" },
  { value: "Poppins",           label: "Poppins",           family: "Poppins, sans-serif" },
  { value: "Nunito",            label: "Nunito",            family: "Nunito, sans-serif" },
  { value: "Roboto",            label: "Roboto",            family: "Roboto, sans-serif" },
  { value: "Montserrat",        label: "Montserrat",        family: "Montserrat, sans-serif" },
  { value: "Lato",              label: "Lato",              family: "Lato, sans-serif" },
  { value: "Raleway",           label: "Raleway",           family: "Raleway, sans-serif" },
  { value: "Oswald",            label: "Oswald",            family: "Oswald, sans-serif" },
  { value: "Playfair Display",  label: "Playfair Display",  family: "'Playfair Display', Georgia, serif" },
  { value: "DM Sans",           label: "DM Sans",           family: "'DM Sans', sans-serif" },
  { value: "Quicksand",         label: "Quicksand",         family: "Quicksand, sans-serif" },
  { value: "Space Grotesk",     label: "Space Grotesk",     family: "'Space Grotesk', sans-serif" },
  { value: "Plus Jakarta Sans", label: "Plus Jakarta Sans", family: "'Plus Jakarta Sans', sans-serif" },
  { value: "Figtree",           label: "Figtree",           family: "Figtree, sans-serif" },
  { value: "Outfit",            label: "Outfit",            family: "Outfit, sans-serif" },
  { value: "System",            label: "Sistema",           family: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
];

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const state = {
  session: null,
  userId: null,
  profile: null,
  fixedExpenses: [],
  debts: [],
  debtInstallments: [],
  monthlyDebtEntries: [],
  savingsGoals: [],
  savingsContributions: [],
  birthdays: [],
  reminders: [],
};

const loginView = document.querySelector("#login-view");
const appView = document.querySelector("#app-view");
const tabsNav = document.querySelector(".tabs");
const loginForm = document.querySelector("#login-form");
const loginButton = document.querySelector("#login-button");
const logoutButton = document.querySelector("#logout-button");
const loginMessage = document.querySelector("#login-message");
const appMessage = document.querySelector("#app-message");
const profileName = document.querySelector("#profile-name");
const loadingState = document.querySelector("#loading-state");

const fixedForm = document.querySelector("#fixed-form");
const debtForm = document.querySelector("#debt-form");
const savingsForm = document.querySelector("#savings-form");
const birthdayForm = document.querySelector("#birthday-form");
const reminderForm = document.querySelector("#reminder-form");
const settingsForm = document.querySelector("#settings-form");
const fontFamilyInput = document.querySelector("#font-family-input");
const accentColorInput = document.querySelector("#accent-color-value");
const colorFamilies = document.querySelector("#color-families");
const colorTones = document.querySelector("#color-tones");
const settingsPreview = document.querySelector("#settings-preview");

let authCheckId = 0;

const COLOR_FAMILIES = [
  { name: "Violeta", base: "#6c63ff", tones: ["#f0efff", "#dddbff", "#c4c0ff", "#aaa3ff", "#8d84ff", "#6c63ff", "#564ee6", "#443dba", "#342f8f", "#252267"] },
  { name: "Azul", base: "#2563eb", tones: ["#eff6ff", "#dbeafe", "#bfdbfe", "#93c5fd", "#60a5fa", "#2563eb", "#1d4ed8", "#1e40af", "#1e3a8a", "#172554"] },
  { name: "Cian", base: "#06b6d4", tones: ["#ecfeff", "#cffafe", "#a5f3fc", "#67e8f9", "#22d3ee", "#06b6d4", "#0891b2", "#0e7490", "#155e75", "#164e63"] },
  { name: "Verde", base: "#16a34a", tones: ["#f0fdf4", "#dcfce7", "#bbf7d0", "#86efac", "#4ade80", "#16a34a", "#15803d", "#166534", "#14532d", "#052e16"] },
  { name: "Lima", base: "#65a30d", tones: ["#f7fee7", "#ecfccb", "#d9f99d", "#bef264", "#a3e635", "#65a30d", "#4d7c0f", "#3f6212", "#365314", "#1a2e05"] },
  { name: "Naranja", base: "#f97316", tones: ["#fff7ed", "#ffedd5", "#fed7aa", "#fdba74", "#fb923c", "#f97316", "#ea580c", "#c2410c", "#9a3412", "#431407"] },
  { name: "Rosa", base: "#ec4899", tones: ["#fdf2f8", "#fce7f3", "#fbcfe8", "#f9a8d4", "#f472b6", "#ec4899", "#db2777", "#be185d", "#9d174d", "#500724"] },
  { name: "Rojo", base: "#ef4444", tones: ["#fef2f2", "#fee2e2", "#fecaca", "#fca5a5", "#f87171", "#ef4444", "#dc2626", "#b91c1c", "#991b1b", "#450a0a"] },
];

let selectedColorFamily = COLOR_FAMILIES[0];
let pendingPreferences = {
  theme_mode: "auto",
  accent_color: "#6c63ff",
  font_family: "Inter",
};

function setLoading(isLoading) {
  loginButton.disabled = isLoading;
  loginButton.textContent = isLoading ? "Entrando..." : "Entrar";
}

function setDataLoading(isLoading) {
  loadingState.classList.toggle("is-active", isLoading);
}

function showApp(isAuthenticated) {
  loginView.hidden = isAuthenticated;
  appView.hidden = !isAuthenticated;
  tabsNav.hidden = !isAuthenticated;
  document.body.classList.toggle("app-active", isAuthenticated);
}

function showLoginMessage(message) {
  loginMessage.textContent = message;
}

function showAppMessage(message, isError = false) {
  appMessage.textContent = message;
  appMessage.style.color = isError ? "var(--danger)" : "var(--primary-strong)";
}

function setProfileName(profile) {
  profileName.textContent = profile.full_name
    ? `Bienvenida, ${profile.full_name}.`
    : "Bienvenida.";
}

function resolveThemeMode(mode) {
  if (mode === "auto") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  return mode || "light";
}

function applyPreferences(profile = {}) {
  const accentColor = profile.accent_color || "#6c63ff";
  const fontFamily = profile.font_family || "Inter";
  const themeMode = profile.theme_mode || "auto";

  document.documentElement.dataset.theme = resolveThemeMode(themeMode);
  document.documentElement.dataset.font = fontFamily;
  document.documentElement.style.setProperty("--accent", accentColor);

  if (settingsForm) {
    settingsForm.elements.theme_mode.value = themeMode;
    settingsForm.elements.accent_color.value = accentColor;
    settingsForm.elements.font_family.value = fontFamily;
  }

  pendingPreferences = {
    theme_mode: themeMode,
    accent_color: accentColor,
    font_family: fontFamily,
  };

  renderColorPicker(accentColor);
  renderFontPicker(fontFamily);
  updateSettingsPreview();
}

function renderFontPicker(selectedValue) {
  const picker = document.querySelector("#font-picker");
  if (!picker || !fontFamilyInput) return;

  fontFamilyInput.value = selectedValue;
  picker.innerHTML = FONTS.map((font) => `
    <button
      class="font-option${font.value === selectedValue ? " is-selected" : ""}"
      type="button"
      role="option"
      aria-selected="${font.value === selectedValue}"
      data-font-value="${font.value}"
      style="font-family: ${font.family}"
    >
      <span class="font-option-name">${font.label}</span>
      <span class="font-option-sample">Aa 0123</span>
    </button>
  `).join("");

  picker.querySelectorAll(".font-option").forEach((btn) => {
    btn.addEventListener("click", () => {
      renderFontPicker(btn.dataset.fontValue);
      updateSettingsPreview();
    });
  });

  const selected = picker.querySelector(".is-selected");
  if (selected) selected.scrollIntoView({ block: "nearest" });
}

function findColorFamily(color) {
  return COLOR_FAMILIES.find((family) => family.tones.includes(color)) || COLOR_FAMILIES[0];
}

function setAccentColor(color) {
  accentColorInput.value = color;
  pendingPreferences.accent_color = color;
  renderColorPicker(color);
  updateSettingsPreview();
}

function updateSettingsPreview() {
  if (!settingsForm || !settingsPreview) return;

  pendingPreferences = {
    theme_mode: settingsForm.elements.theme_mode.value,
    accent_color: settingsForm.elements.accent_color.value,
    font_family: settingsForm.elements.font_family.value,
  };

  settingsPreview.dataset.previewTheme = resolveThemeMode(pendingPreferences.theme_mode);
  settingsPreview.dataset.font = pendingPreferences.font_family;
  settingsPreview.style.setProperty("--preview-accent", pendingPreferences.accent_color);
}

function renderColorPicker(activeColor = accentColorInput?.value || "#6c63ff") {
  if (!colorFamilies || !colorTones) return;

  selectedColorFamily = findColorFamily(activeColor);

  colorFamilies.innerHTML = COLOR_FAMILIES.map((family) => `
    <button
      class="color-swatch ${family.name === selectedColorFamily.name ? "is-active" : ""}"
      type="button"
      data-color-family="${family.name}"
      title="${family.name}"
      aria-label="${family.name}"
      style="--swatch: ${family.base}"
    ></button>
  `).join("");

  colorTones.innerHTML = selectedColorFamily.tones.map((tone) => `
    <button
      class="color-swatch tone-swatch ${tone === activeColor ? "is-active" : ""}"
      type="button"
      data-color-tone="${tone}"
      title="${tone}"
      aria-label="${tone}"
      style="--swatch: ${tone}"
    ></button>
  `).join("");

  colorFamilies.querySelectorAll("[data-color-family]").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedColorFamily = COLOR_FAMILIES.find((f) => f.name === btn.dataset.colorFamily);
      setAccentColor(selectedColorFamily.base);
    });
  });

  colorTones.querySelectorAll("[data-color-tone]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setAccentColor(btn.dataset.colorTone);
    });
  });
}

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if ((state.profile?.theme_mode || "auto") === "auto") {
    applyPreferences(state.profile);
  }
});

function money(value) {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));
}

function toNumber(value) {
  return Number.parseFloat(value || "0") || 0;
}

function sumBy(items, key) {
  return items.reduce((total, item) => total + Number(item[key] || 0), 0);
}

function monthStart(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}-01`;
}

function monthInputToDate(value) {
  return `${value}-01`;
}

function addMonths(monthDate, amount) {
  const date = new Date(`${monthDate}T00:00:00`);
  date.setMonth(date.getMonth() + amount);
  return monthStart(date);
}

function monthsBetweenInclusive(startMonth, endMonth) {
  const start = new Date(`${startMonth}T00:00:00`);
  const end = new Date(`${endMonth}T00:00:00`);
  return (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth() + 1;
}

function formatDate(value) {
  if (!value) return "Sin fecha";
  return new Intl.DateTimeFormat("es-EC", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function formatDateTime(value) {
  if (!value) return "Sin fecha";
  return new Intl.DateTimeFormat("es-EC", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatMonth(value) {
  if (!value) return "Sin mes";
  return new Intl.DateTimeFormat("es-EC", {
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function currentMonthKey() {
  return monthStart();
}

function nextBirthdayDate(birthDate) {
  const today = new Date();
  const source = new Date(`${birthDate}T00:00:00`);
  const next = new Date(today.getFullYear(), source.getMonth(), source.getDate());

  if (next < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
    next.setFullYear(today.getFullYear() + 1);
  }

  return next;
}

function emptyState(text) {
  return `<div class="empty-state">${text}</div>`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

async function getAuthorizedProfile(session) {
  if (!session?.user?.id) {
    return null;
  }

  const { data, error } = await supabaseClient
    .from(TABLES.profiles)
    .select("id, full_name, theme_mode, accent_color, font_family")
    .eq("id", session.user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

async function applySession(session, options = {}) {
  const currentCheck = ++authCheckId;

  if (!session) {
    showApp(false);
    return false;
  }

  try {
    const profile = await getAuthorizedProfile(session);

    if (currentCheck !== authCheckId) {
      return false;
    }

    if (!profile) {
      await supabaseClient.auth.signOut();
      showApp(false);

      if (options.showDeniedMessage) {
        showLoginMessage("Tu usuario existe, pero no esta habilitado en la gestion de gastos.");
      }

      return false;
    }

    state.session = session;
    state.userId = session.user.id;
    state.profile = profile;
    setProfileName(profile);
    applyPreferences(profile);
    showLoginMessage("");
    showApp(true);
    await loadAppData();
    return true;
  } catch (_error) {
    await supabaseClient.auth.signOut();
    showApp(false);

    if (options.showDeniedMessage) {
      showLoginMessage("No pudimos validar tu acceso. Intenta nuevamente.");
    }

    return false;
  }
}

async function selectTable(table, orderColumn = "created_at", ascending = false) {
  const { data, error } = await supabaseClient
    .from(table)
    .select("*")
    .eq("user_id", state.userId)
    .order(orderColumn, { ascending });

  if (error) throw error;
  return data || [];
}

async function loadAppData() {
  if (!state.userId) return;

  setDataLoading(true);
  showAppMessage("");

  try {
    const [
      fixedExpenses,
      debts,
      debtInstallments,
      monthlyDebtEntries,
      savingsGoals,
      savingsContributions,
      birthdays,
      reminders,
    ] = await Promise.all([
      selectTable(TABLES.fixedExpenses, "created_at"),
      selectTable(TABLES.debts, "created_at"),
      selectTable(TABLES.debtInstallments, "due_month", true),
      selectTable(TABLES.monthlyDebtEntries, "entry_month", true),
      selectTable(TABLES.savingsGoals, "created_at"),
      selectTable(TABLES.savingsContributions, "created_at"),
      selectTable(TABLES.birthdays, "birth_date", true),
      selectTable(TABLES.reminders, "created_at"),
    ]);

    state.fixedExpenses = fixedExpenses;
    state.debts = debts;
    state.debtInstallments = debtInstallments;
    state.monthlyDebtEntries = monthlyDebtEntries;
    state.savingsGoals = savingsGoals;
    state.savingsContributions = savingsContributions;
    state.birthdays = birthdays;
    state.reminders = reminders;
    render();
  } catch (error) {
    showAppMessage(`No pudimos cargar los datos: ${error.message}`, true);
  } finally {
    setDataLoading(false);
  }
}

function render() {
  renderDashboard();
  renderFixedExpenses();
  renderDebts();
  renderSavings();
  renderBirthdays();
  renderReminders();
  createIcons();
}

function renderDashboard() {
  const activeExpenses = state.fixedExpenses.filter((expense) => {
    if (!expense.is_active) return false;
    if ((expense.expense_type || "fixed") === "fixed") return true;
    return monthStart(new Date(`${expense.expense_date}T00:00:00`)) === currentMonthKey();
  });
  const activeDebts = state.debts.filter((debt) => debt.status === "active");
  const activeSavings = state.savingsGoals.filter((goal) => goal.is_active);
  const upcomingBirthdays = getUpcomingBirthdays();
  const pendingReminders = state.reminders.filter((reminder) => reminder.status === "pending");

  document.querySelector("#metric-fixed").textContent = money(sumBy(activeExpenses, "amount"));
  document.querySelector("#metric-debt").textContent = money(sumBy(activeDebts, "current_balance"));
  document.querySelector("#metric-savings").textContent = money(sumBy(activeSavings, "monthly_amount"));
  document.querySelector("#metric-birthdays").textContent = String(upcomingBirthdays.length);
  document.querySelector("#metric-reminders").textContent = String(pendingReminders.length);

  renderDebtMonthSummary();
  renderBirthdayPreview(upcomingBirthdays);
  renderReminderPreview(pendingReminders);
}

function renderDebtMonthSummary() {
  const container = document.querySelector("#debt-month-summary");
  const byMonth = new Map();

  state.monthlyDebtEntries.forEach((entry) => {
    byMonth.set(entry.entry_month, (byMonth.get(entry.entry_month) || 0) + Number(entry.amount || 0));
  });

  const rows = [...byMonth.entries()].sort((a, b) => b[1] - a[1]);

  if (!rows.length) {
    container.innerHTML = emptyState("Aun no hay deuda mensual registrada.");
    return;
  }

  const max = rows[0];
  const min = rows[rows.length - 1];

  container.innerHTML = rows
    .map(([month, amount]) => {
      const label = month === max[0] ? "Mas deuda" : month === min[0] ? "Menos deuda" : "Mes";
      return `
        <article class="list-item">
          <div class="item-top">
            <div>
              <p class="item-title">${formatMonth(month)}</p>
              <p class="item-meta">${label}</p>
            </div>
            <strong class="item-amount">${money(amount)}</strong>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderBirthdayPreview(items) {
  const container = document.querySelector("#birthday-preview");
  const preview = items.slice(0, 4);

  if (!preview.length) {
    container.innerHTML = emptyState("Agrega los cumpleaños de la familia.");
    return;
  }

  container.innerHTML = preview
    .map((birthday) => `
      <article class="list-item">
        <div class="item-top">
          <div>
            <p class="item-title">${escapeHtml(birthday.person_name)}</p>
            <p class="item-meta">${escapeHtml(birthday.relationship || "Familia")} - ${formatDate(birthday.birth_date)}</p>
          </div>
        </div>
      </article>
    `)
    .join("");
}

function renderReminderPreview(items) {
  const container = document.querySelector("#reminder-preview");
  const preview = [...items]
    .sort((a, b) => new Date(a.remind_at || a.created_at) - new Date(b.remind_at || b.created_at))
    .slice(0, 4);

  if (!preview.length) {
    container.innerHTML = emptyState("No hay recordatorios pendientes.");
    return;
  }

  container.innerHTML = preview
    .map((reminder) => `
      <article class="list-item">
        <div class="item-top">
          <div>
            <p class="item-title">${escapeHtml(reminder.title)}</p>
            <p class="item-meta">${reminder.remind_at ? formatDateTime(reminder.remind_at) : "Sin fecha"}</p>
          </div>
        </div>
      </article>
    `)
    .join("");
}

function renderFixedExpenses() {
  const container = document.querySelector("#fixed-list");
  const activeTotal = sumBy(state.fixedExpenses.filter((expense) => expense.is_active), "amount");
  document.querySelector("#fixed-total").textContent = money(activeTotal);

  if (!state.fixedExpenses.length) {
    container.innerHTML = emptyState("Agrega tus gastos fijos o variables.");
    return;
  }

  container.innerHTML = state.fixedExpenses
    .map((expense) => `
      <article class="list-item">
        <div class="item-top">
          <div>
            <p class="item-title">${escapeHtml(expense.name)}</p>
            <p class="item-meta">${(expense.expense_type || "fixed") === "fixed" ? "Fijo" : "Variable"} - ${escapeHtml(expense.category || "Sin categoria")}</p>
            <p class="item-meta">${(expense.expense_type || "fixed") === "fixed" ? `Dia ${expense.day_of_month || "sin definir"}` : formatDate(expense.expense_date)} - ${expense.is_active ? "Activo" : "Inactivo"}</p>
          </div>
          <strong class="item-amount">${money(expense.amount)}</strong>
        </div>
        <div class="item-actions">
          <button class="small-button" type="button" data-action="toggle-expense" data-id="${expense.id}">
            <i data-lucide="${expense.is_active ? "pause" : "play"}"></i><span>${expense.is_active ? "Pausar" : "Activar"}</span>
          </button>
          <button class="danger-button" type="button" data-action="delete-expense" data-id="${expense.id}">
            <i data-lucide="trash-2"></i><span>Eliminar</span>
          </button>
        </div>
      </article>
    `)
    .join("");
}

function renderDebts() {
  const container = document.querySelector("#debt-list");
  const activeDebts = state.debts.filter((debt) => debt.status === "active");
  document.querySelector("#debt-total").textContent = money(sumBy(activeDebts, "current_balance"));

  if (!state.debts.length) {
    container.innerHTML = emptyState("Agrega una deuda para empezar el seguimiento.");
    return;
  }

  container.innerHTML = state.debts
    .map((debt) => {
      const installments = state.debtInstallments
        .filter((installment) => installment.debt_id === debt.id)
        .sort((a, b) => a.installment_number - b.installment_number);

      return `
        <article class="list-item">
          <div class="item-top">
            <div>
              <p class="item-title">${escapeHtml(debt.person_or_entity)}</p>
              <p class="item-meta">${escapeHtml(debt.description || "Sin descripcion")} - ${debt.status}</p>
              <p class="item-meta">${debt.installment_count || installments.length || 1} cuota(s) desde ${formatMonth(debt.first_due_month || debt.due_date)}</p>
            </div>
            <strong class="item-amount">${money(debt.current_balance)}</strong>
          </div>
          <form class="inline-form" data-action="pay-debt" data-id="${debt.id}">
            <input name="amount" type="number" min="0.01" step="0.01" placeholder="Pago a deuda" ${debt.status !== "active" ? "disabled" : ""} required />
            <button class="small-button" type="submit" ${debt.status !== "active" ? "disabled" : ""} title="Registrar pago" aria-label="Registrar pago">
              <i data-lucide="check"></i>
            </button>
          </form>
          ${renderInstallments(installments, debt.status !== "active")}
          <div class="item-actions">
            <button class="danger-button" type="button" data-action="delete-debt" data-id="${debt.id}">
              <i data-lucide="trash-2"></i><span>Eliminar</span>
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderInstallments(installments, isDisabled) {
  if (!installments.length) {
    return emptyState("Esta deuda aun no tiene cuotas generadas.");
  }

  return `
    <div class="installment-list">
      ${installments
        .map((installment) => {
          const pending = Number(installment.amount) - Number(installment.paid_amount || 0);
          const isPaid = installment.status === "paid";

          return `
            <div class="installment-row ${isPaid ? "is-paid" : ""}">
              <div class="installment-main">
                <div>
                  <p class="item-title">Cuota ${installment.installment_number}</p>
                  <p class="item-meta">${formatMonth(installment.due_month)} - pagado ${money(installment.paid_amount)}</p>
                </div>
                <div>
                  <strong class="item-amount">${money(installment.amount)}</strong>
                  <div class="status-pill ${isPaid ? "" : "is-pending"}">${installment.status}</div>
                </div>
              </div>
              <form class="inline-form" data-action="adjust-installment" data-id="${installment.id}">
                <input name="amount" type="number" min="${Math.max(Number(installment.paid_amount || 0), 0.01).toFixed(2)}" step="0.01" value="${Number(installment.amount).toFixed(2)}" ${isPaid || isDisabled ? "disabled" : ""} required />
                <input name="due_month" type="month" value="${installment.due_month.slice(0, 7)}" ${isPaid || isDisabled ? "disabled" : ""} required />
                <button class="small-button" type="submit" ${isPaid || isDisabled ? "disabled" : ""} title="Ajustar cuota" aria-label="Ajustar cuota">
                  <i data-lucide="save"></i>
                </button>
              </form>
              <div class="item-actions">
                <button class="small-button" type="button" data-action="pay-installment" data-id="${installment.id}" ${isPaid || isDisabled ? "disabled" : ""}>
                  <i data-lucide="check-circle"></i><span>Pagar ${money(pending)}</span>
                </button>
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderSavings() {
  const container = document.querySelector("#savings-list");
  const activeGoals = state.savingsGoals.filter((goal) => goal.is_active);
  document.querySelector("#savings-total").textContent = `${money(sumBy(activeGoals, "monthly_amount"))}/mes`;

  if (!state.savingsGoals.length) {
    container.innerHTML = emptyState("Crea una meta para calcular el ahorro mensual.");
    return;
  }

  container.innerHTML = state.savingsGoals
    .map((goal) => {
      const saved = sumBy(
        state.savingsContributions.filter((item) => item.savings_goal_id === goal.id),
        "amount",
      );
      const percent = Math.min((saved / Number(goal.target_amount || 1)) * 100, 100);

      return `
        <article class="list-item">
          <div class="item-top">
            <div>
              <p class="item-title">${escapeHtml(goal.name)}</p>
              <p class="item-meta">${formatMonth(goal.start_month)} a ${formatMonth(goal.end_month)}</p>
              <p class="item-meta">${money(goal.monthly_amount)} por mes</p>
            </div>
            <strong class="item-amount">${money(saved)}</strong>
          </div>
          <div class="progress-track" aria-label="Progreso de ahorro">
            <div class="progress-bar" style="width: ${percent}%"></div>
          </div>
          <form class="inline-form" data-action="add-saving" data-id="${goal.id}">
            <input name="amount" type="number" min="0.01" step="0.01" placeholder="Aporte" required />
            <button class="small-button" type="submit" title="Registrar aporte" aria-label="Registrar aporte">
              <i data-lucide="plus"></i>
            </button>
          </form>
          <div class="item-actions">
            <button class="small-button" type="button" data-action="toggle-saving" data-id="${goal.id}">
              <i data-lucide="${goal.is_active ? "pause" : "play"}"></i><span>${goal.is_active ? "Pausar" : "Activar"}</span>
            </button>
            <button class="danger-button" type="button" data-action="delete-saving" data-id="${goal.id}">
              <i data-lucide="trash-2"></i><span>Eliminar</span>
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}

function getUpcomingBirthdays() {
  return [...state.birthdays].sort((a, b) => nextBirthdayDate(a.birth_date) - nextBirthdayDate(b.birth_date));
}

function renderBirthdays() {
  const container = document.querySelector("#birthday-list");
  const birthdays = getUpcomingBirthdays();
  document.querySelector("#birthday-total").textContent = String(birthdays.length);

  if (!birthdays.length) {
    container.innerHTML = emptyState("Agrega los cumpleaños de la familia.");
    return;
  }

  container.innerHTML = birthdays
    .map((birthday) => `
      <article class="list-item">
        <div class="item-top">
          <div>
            <p class="item-title">${escapeHtml(birthday.person_name)}</p>
            <p class="item-meta">${escapeHtml(birthday.relationship || "Familia")} - ${formatDate(birthday.birth_date)}</p>
            <p class="item-meta">${escapeHtml(birthday.notes || "")}</p>
          </div>
        </div>
        <div class="item-actions">
          <button class="danger-button" type="button" data-action="delete-birthday" data-id="${birthday.id}">
            <i data-lucide="trash-2"></i><span>Eliminar</span>
          </button>
        </div>
      </article>
    `)
    .join("");
}

function renderReminders() {
  const container = document.querySelector("#reminder-list");
  const reminders = [...state.reminders].sort((a, b) => {
    if (a.status !== b.status) return a.status === "pending" ? -1 : 1;
    return new Date(a.remind_at || a.created_at) - new Date(b.remind_at || b.created_at);
  });

  document.querySelector("#reminder-total").textContent = String(
    reminders.filter((reminder) => reminder.status === "pending").length,
  );

  if (!reminders.length) {
    container.innerHTML = emptyState("Agrega notas o recordatorios importantes.");
    return;
  }

  container.innerHTML = reminders
    .map((reminder) => `
      <article class="list-item ${reminder.status === "done" ? "installment-row is-paid" : ""}">
        <div class="item-top">
          <div>
            <p class="item-title">${escapeHtml(reminder.title)}</p>
            <p class="item-meta">${escapeHtml(reminder.note || "Sin nota")}</p>
            <p class="item-meta">${reminder.remind_at ? formatDateTime(reminder.remind_at) : "Sin fecha definida"}</p>
          </div>
          <span class="status-pill ${reminder.status === "pending" ? "is-pending" : ""}">${reminder.status}</span>
        </div>
        <div class="item-actions">
          <button class="small-button" type="button" data-action="toggle-reminder" data-id="${reminder.id}">
            <i data-lucide="${reminder.status === "done" ? "rotate-ccw" : "check-circle"}"></i><span>${reminder.status === "done" ? "Reabrir" : "Hecho"}</span>
          </button>
          <button class="danger-button" type="button" data-action="delete-reminder" data-id="${reminder.id}">
            <i data-lucide="trash-2"></i><span>Eliminar</span>
          </button>
        </div>
      </article>
    `)
    .join("");
}

async function insertRow(table, values) {
  const { error } = await supabaseClient.from(table).insert(values);
  if (error) throw error;
}

async function updateRow(table, id, values) {
  const { error } = await supabaseClient
    .from(table)
    .update(values)
    .eq("id", id)
    .eq("user_id", state.userId);

  if (error) throw error;
}

async function deleteRow(table, id) {
  const { error } = await supabaseClient
    .from(table)
    .delete()
    .eq("id", id)
    .eq("user_id", state.userId);

  if (error) throw error;
}

async function insertInstallments(debtId, totalAmount, installmentCount, firstDueMonth) {
  const baseAmount = Number((totalAmount / installmentCount).toFixed(2));
  let assigned = 0;

  const rows = Array.from({ length: installmentCount }, (_item, index) => {
    const installmentNumber = index + 1;
    const isLast = installmentNumber === installmentCount;
    const amount = isLast ? Number((totalAmount - assigned).toFixed(2)) : baseAmount;
    assigned = Number((assigned + amount).toFixed(2));

    return {
      user_id: state.userId,
      debt_id: debtId,
      installment_number: installmentNumber,
      due_month: addMonths(firstDueMonth, index),
      amount,
    };
  });

  await insertRow(TABLES.debtInstallments, rows);
}

async function applyPaymentToInstallments(debtId, paymentAmount) {
  let remaining = Number(paymentAmount);
  const installments = state.debtInstallments
    .filter((installment) => installment.debt_id === debtId && installment.status !== "paid")
    .sort((a, b) => new Date(a.due_month) - new Date(b.due_month));

  for (const installment of installments) {
    if (remaining <= 0) break;

    const pending = Number(installment.amount) - Number(installment.paid_amount || 0);
    const applied = Math.min(pending, remaining);
    const paidAmount = Number((Number(installment.paid_amount || 0) + applied).toFixed(2));
    const status = paidAmount >= Number(installment.amount) ? "paid" : "partial";

    await updateRow(TABLES.debtInstallments, installment.id, {
      paid_amount: paidAmount,
      status,
      paid_at: status === "paid" ? new Date().toISOString() : null,
    });

    remaining = Number((remaining - applied).toFixed(2));
  }
}

async function handleSubmit(form, action, options = {}) {
  const shouldReset = options.reset ?? true;
  const shouldReload = options.reload ?? true;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]') || form.querySelector("button");
    button.disabled = true;
    showAppMessage("");

    try {
      await action(new FormData(form));
      if (shouldReset) {
        form.reset();
      }
      if (shouldReload) {
        await loadAppData();
      }
      showAppMessage("Guardado correctamente.");
    } catch (error) {
      showAppMessage(error.message, true);
    } finally {
      button.disabled = false;
    }
  });
}

handleSubmit(fixedForm, async (formData) => {
  const expenseType = String(formData.get("expense_type"));

  await insertRow(TABLES.fixedExpenses, {
    user_id: state.userId,
    expense_type: expenseType,
    name: String(formData.get("name")).trim(),
    amount: toNumber(formData.get("amount")),
    category: String(formData.get("category")).trim() || null,
    expense_date: formData.get("expense_date") || new Date().toISOString().slice(0, 10),
    day_of_month: formData.get("day_of_month") ? Number(formData.get("day_of_month")) : null,
  });
});

handleSubmit(debtForm, async (formData) => {
  const amount = toNumber(formData.get("total_amount"));
  const installmentCount = Math.max(Number(formData.get("installment_count")) || 1, 1);
  const firstDueMonth = monthInputToDate(formData.get("first_due_month"));
  const monthlyPayment = Number((amount / installmentCount).toFixed(2));
  const finalDueMonth = addMonths(firstDueMonth, installmentCount - 1);
  const debt = {
    user_id: state.userId,
    person_or_entity: String(formData.get("person_or_entity")).trim(),
    description: String(formData.get("description")).trim() || null,
    total_amount: amount,
    current_balance: amount,
    installment_count: installmentCount,
    monthly_payment: monthlyPayment,
    first_due_month: firstDueMonth,
    due_date: finalDueMonth,
    status: "active",
  };

  const { data, error } = await supabaseClient.from(TABLES.debts).insert(debt).select("id").single();
  if (error) throw error;

  await insertInstallments(data.id, amount, installmentCount, firstDueMonth);

  await insertRow(TABLES.monthlyDebtEntries, {
    user_id: state.userId,
    debt_id: data.id,
    amount,
    entry_month: monthStart(),
  });
});

handleSubmit(savingsForm, async (formData) => {
  const startMonth = monthInputToDate(formData.get("start_month"));
  const endMonth = monthInputToDate(formData.get("end_month"));
  const monthCount = monthsBetweenInclusive(startMonth, endMonth);

  if (monthCount < 1) {
    throw new Error("La fecha final debe ser igual o posterior a la inicial.");
  }

  const targetAmount = toNumber(formData.get("target_amount"));

  await insertRow(TABLES.savingsGoals, {
    user_id: state.userId,
    name: String(formData.get("name")).trim(),
    target_amount: targetAmount,
    start_month: startMonth,
    end_month: endMonth,
    monthly_amount: Number((targetAmount / monthCount).toFixed(2)),
  });
});

handleSubmit(birthdayForm, async (formData) => {
  await insertRow(TABLES.birthdays, {
    user_id: state.userId,
    person_name: String(formData.get("person_name")).trim(),
    relationship: String(formData.get("relationship")).trim() || null,
    birth_date: formData.get("birth_date"),
    notes: String(formData.get("notes")).trim() || null,
  });
});

handleSubmit(reminderForm, async (formData) => {
  await insertRow(TABLES.reminders, {
    user_id: state.userId,
    title: String(formData.get("title")).trim(),
    note: String(formData.get("note")).trim() || null,
    remind_at: formData.get("remind_at")
      ? new Date(formData.get("remind_at")).toISOString()
      : null,
  });
});

handleSubmit(settingsForm, async (formData) => {
  const preferences = {
    theme_mode: String(formData.get("theme_mode")),
    accent_color: String(formData.get("accent_color")),
    font_family: String(formData.get("font_family")),
  };

  const { error } = await supabaseClient
    .from(TABLES.profiles)
    .update(preferences)
    .eq("id", state.userId);

  if (error) throw error;

  state.profile = { ...state.profile, ...preferences };
  applyPreferences(state.profile);
}, { reset: false, reload: false });

settingsForm.addEventListener("change", (event) => {
  if (event.target.matches("select")) {
    updateSettingsPreview();
  }
});

document.querySelector("#font-picker");

appView.addEventListener("click", async (event) => {
  const familyButton = event.target.closest("button[data-color-family]");
  if (familyButton) return; // handled directly on each button

  const toneButton = event.target.closest("button[data-color-tone]");
  if (toneButton) return; // handled directly on each button

  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const { action, id } = button.dataset;
  button.disabled = true;
  showAppMessage("");

  try {
    if (action === "toggle-expense") {
      const expense = state.fixedExpenses.find((item) => item.id === id);
      await updateRow(TABLES.fixedExpenses, id, { is_active: !expense.is_active });
    }

    if (action === "delete-expense") {
      await deleteRow(TABLES.fixedExpenses, id);
    }

    if (action === "delete-debt") {
      await deleteRow(TABLES.debts, id);
    }

    if (action === "pay-installment") {
      const installment = state.debtInstallments.find((item) => item.id === id);
      const debt = state.debts.find((item) => item.id === installment.debt_id);
      const pending = Number(installment.amount) - Number(installment.paid_amount || 0);
      const nextBalance = Math.max(Number(debt.current_balance) - pending, 0);

      await insertRow(TABLES.debtPayments, {
        user_id: state.userId,
        debt_id: debt.id,
        amount: pending,
      });

      await updateRow(TABLES.debtInstallments, id, {
        paid_amount: Number(installment.amount),
        status: "paid",
        paid_at: new Date().toISOString(),
      });

      await updateRow(TABLES.debts, debt.id, {
        current_balance: Number(nextBalance.toFixed(2)),
        status: nextBalance <= 0 ? "paid" : "active",
      });
    }

    if (action === "toggle-saving") {
      const goal = state.savingsGoals.find((item) => item.id === id);
      await updateRow(TABLES.savingsGoals, id, { is_active: !goal.is_active });
    }

    if (action === "delete-saving") {
      await deleteRow(TABLES.savingsGoals, id);
    }

    if (action === "delete-birthday") {
      await deleteRow(TABLES.birthdays, id);
    }

    if (action === "toggle-reminder") {
      const reminder = state.reminders.find((item) => item.id === id);
      await updateRow(TABLES.reminders, id, {
        status: reminder.status === "done" ? "pending" : "done",
      });
    }

    if (action === "delete-reminder") {
      await deleteRow(TABLES.reminders, id);
    }

    await loadAppData();
    showAppMessage("Actualizado correctamente.");
  } catch (error) {
    showAppMessage(error.message, true);
  } finally {
    button.disabled = false;
  }
});

appView.addEventListener("submit", async (event) => {
  const form = event.target.closest("form[data-action]");
  if (!form) return;

  event.preventDefault();
  const button = form.querySelector("button");
  const { action, id } = form.dataset;
  const amount = toNumber(new FormData(form).get("amount"));
  button.disabled = true;
  showAppMessage("");

  try {
    if (action === "pay-debt") {
      const debt = state.debts.find((item) => item.id === id);
      const nextBalance = Math.max(Number(debt.current_balance) - amount, 0);

      await insertRow(TABLES.debtPayments, {
        user_id: state.userId,
        debt_id: id,
        amount,
      });

      await applyPaymentToInstallments(id, amount);

      await updateRow(TABLES.debts, id, {
        current_balance: Number(nextBalance.toFixed(2)),
        status: nextBalance <= 0 ? "paid" : "active",
      });
    }

    if (action === "adjust-installment") {
      const formData = new FormData(form);
      const installment = state.debtInstallments.find((item) => item.id === id);
      const nextAmount = toNumber(formData.get("amount"));
      const paidAmount = Number(installment.paid_amount || 0);

      await updateRow(TABLES.debtInstallments, id, {
        amount: nextAmount,
        due_month: monthInputToDate(formData.get("due_month")),
        status: paidAmount <= 0 ? "pending" : paidAmount >= nextAmount ? "paid" : "partial",
        paid_at: paidAmount >= nextAmount ? new Date().toISOString() : null,
      });
    }

    if (action === "add-saving") {
      await insertRow(TABLES.savingsContributions, {
        user_id: state.userId,
        savings_goal_id: id,
        amount,
      });
    }

    form.reset();
    await loadAppData();
    showAppMessage("Movimiento registrado.");
  } catch (error) {
    showAppMessage(error.message, true);
  } finally {
    button.disabled = false;
  }
});

document.querySelectorAll(".tab-button").forEach((button) => {
  button.addEventListener("click", () => {
    const tab = button.dataset.tab;

    document.querySelectorAll(".tab-button").forEach((item) => {
      item.classList.toggle("is-active", item === button);
    });

    document.querySelectorAll(".app-view").forEach((view) => {
      view.classList.toggle("is-active", view.id === `${tab}-view`);
    });

    appView.scrollTo({ top: 0, behavior: "smooth" });
    window.scrollTo({
      top: Math.max(appView.getBoundingClientRect().top + window.scrollY - 8, 0),
      behavior: "smooth",
    });
  });
});

const SESSION_MAX_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const SESSION_KEY = "gn_login_at";

function hideSplash() {
  const splash = document.getElementById("auth-splash");
  if (!splash) return;
  splash.classList.add("is-hidden");
  setTimeout(() => splash.remove(), 320);
}

async function loadSession() {
  try {
    const { data } = await supabaseClient.auth.getSession();
    const session = data.session;

    if (session) {
      const loginAt = parseInt(localStorage.getItem(SESSION_KEY) || "0", 10);
      if (loginAt && Date.now() - loginAt > SESSION_MAX_MS) {
        await supabaseClient.auth.signOut();
        localStorage.removeItem(SESSION_KEY);
        hideSplash();
        showApp(false);
        return;
      }
    }

    await applySession(session);
  } finally {
    hideSplash();
  }
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  showLoginMessage("");
  setLoading(true);

  const formData = new FormData(loginForm);
  const email = String(formData.get("email")).trim();
  const password = String(formData.get("password"));

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    setLoading(false);
    showLoginMessage("No pudimos iniciar sesion. Revisa el correo y la contrasena.");
    return;
  }

  localStorage.setItem(SESSION_KEY, String(Date.now()));

  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  const isAuthorized = await applySession(session, { showDeniedMessage: true });
  setLoading(false);

  if (isAuthorized) {
    loginForm.reset();
  }
});

logoutButton.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  localStorage.removeItem(SESSION_KEY);
  state.session = null;
  state.userId = null;
  showApp(false);
});

supabaseClient.auth.onAuthStateChange((_event, session) => {
  if (!session) {
    showApp(false);
  }
});

renderColorPicker();
createIcons();
loadSession();
