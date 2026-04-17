// Cyber Risk Command Center — Shared Logic
// Navigation, Translations, Language Switcher, Auth, Crypto

// ── HTML sanitizer ────────────────────────────────────────────────────────────
function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ── JWT-based auth helpers ────────────────────────────────────────────────────

/** Return stored JWT token or null — rejects literal "undefined"/"null" strings */
function getToken() {
  const t = localStorage.getItem('crcc_jwt');
  if (!t || t === 'undefined' || t === 'null') return null;
  return t;
}

/** Decode JWT payload (base64url) without verifying signature (server verifies) */
function decodeJwtPayload(token) {
  try {
    const part = token.split('.')[1];
    const padded = part.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(padded));
  } catch (e) {
    return null;
  }
}

/** Returns true when a valid, non-expired JWT is stored */
function checkAuth() {
  const token = getToken();
  if (!token) return false;
  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) return false;
  return payload.exp * 1000 > Date.now();
}

/** Redirect to login if not authenticated */
function requireAuth() {
  if (!checkAuth()) {
    const here = encodeURIComponent(location.pathname + location.search);
    location.replace('login.html?next=' + here);
  }
}

/** Returns display name from JWT payload */
function getCurrentUser() {
  const token = getToken();
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  return payload ? payload.name : null;
}

/** Returns user role from JWT payload */
function getCurrentRole() {
  const token = getToken();
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  return payload ? payload.role : null;
}

/** Clear JWT and redirect to login */
function logout() {
  localStorage.removeItem('crcc_jwt');
  location.replace('login.html');
}

/**
 * Generic API helper — attaches Bearer token and returns parsed JSON.
 * Throws on HTTP errors. Auto-redirects to login on 401.
 */
async function apiRequest(method, endpoint, body) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = 'Bearer ' + token;

  const opts = { method, headers };
  if (body !== undefined) opts.body = JSON.stringify(body);

  const res = await fetch('/api' + endpoint, opts);

  if (res.status === 401) {
    logout();
    throw new Error('Session expired');
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// ── API-backed data loader ────────────────────────────────────────────────────
async function loadIndicatorsData() {
  return apiRequest('GET', '/indicators');
}

async function loadHistoryData() {
  return apiRequest('GET', '/history');
}

// ── Translations ──────────────────────────────────────────────────────────────
const TRANSLATIONS = {
  pt: {
    // Nav
    nav_dashboard: 'Dashboard',
    nav_analytics: 'Analytics',
    nav_docs: 'Documentação',
    nav_admin: 'Admin',
    // Header
    header_title: 'Cyber Risk Command Center',
    header_subtitle: 'Executive Cybersecurity Dashboard',
    // Auth
    login_title: 'Entrar',
    login_email: 'E-mail',
    login_password: 'Senha',
    login_btn: 'Entrar',
    login_no_account: 'Não tem conta?',
    login_register_link: 'Cadastre-se',
    login_error: 'E-mail ou senha incorretos.',
    login_locked: 'Conta bloqueada. Tente novamente em 15 minutos.',
    register_title: 'Criar Conta',
    register_name: 'Nome completo',
    register_email: 'E-mail',
    register_password: 'Senha',
    register_confirm: 'Confirmar senha',
    register_btn: 'Criar conta',
    register_have_account: 'Já tem conta?',
    register_login_link: 'Entrar',
    register_error_exists: 'E-mail já cadastrado.',
    register_error_mismatch: 'As senhas não conferem.',
    register_error_weak: 'Senha fraca: mínimo 8 caracteres, uma maiúscula e um número.',
    register_success: 'Conta criada! Redirecionando...',
    register_password_hint: 'Mínimo 8 caracteres, uma maiúscula e um número',
    logout_btn: 'Sair',
    welcome_user: 'Olá,',
    // Admin
    admin_title: 'Gerenciar Indicadores',
    admin_save: 'Salvar Alterações',
    admin_reset: 'Restaurar Padrões',
    admin_export: 'Exportar JSON',
    admin_import: 'Importar JSON',
    admin_saved: 'Salvo com sucesso!',
    admin_reset_confirm: 'Restaurar padrões? Todas as edições serão perdidas.',
    admin_metadata: 'Metadados',
    admin_period: 'Período',
    admin_last_updated: 'Última Atualização',
    // Executive Summary
    section_executive: 'EXECUTIVE SUMMARY',
    on_target: 'No Alvo',
    warning: 'Atenção',
    alert: 'Alerta',
    // Score names
    hygiene_score: 'Hygiene Score',
    resilience_score: 'Resilience Score',
    human_score: 'Human Score',
    risk_score: 'Risk Score',
    // Score subtitles
    hygiene_subtitle: 'Controles Preventivos',
    resilience_subtitle: 'Capacidade de Resposta',
    human_subtitle: 'Cultura de Segurança',
    risk_subtitle: 'Exposição a Riscos',
    // Stats bar
    total_indicators: 'Total Indicadores',
    kpis_on_target: 'KPIs no Alvo',
    kris_in_alert: 'KRIs em Alerta',
    improvements: 'Melhorias',
    period: 'Período',
    // Filter
    search_placeholder: 'Buscar indicador...',
    filter_all: 'TODOS',
    toggle_improvements: '🚀 Melhorias',
    // Indicator cards
    badge_kpi: 'KPI',
    badge_kri: 'KRI',
    badge_improvement: '🚀 MELHORIA',
    score_label: 'Score',
    target_label: 'Meta',
    value_label: 'Valor',
    why_matters: 'Por que importa',
    scores_feeds: 'Alimenta',
    section_improvements: 'MELHORIAS NO ROADMAP',
    no_results: 'Nenhum indicador encontrado.',
    // Footer
    footer_created: 'Criado por Arthur Paixao',
    // Charts page
    section_analytics: 'ANALYTICS',
    chart_exec_scores: 'Evolução dos Executive Scores',
    chart_domain_health: 'Saúde por Domínio',
    chart_kpi_kri: 'Distribuição KPI/KRI',
    chart_compliance: 'Compliance por Domínio (%)',
    chart_annual: 'Scores Anuais por Categoria',
    chart_incidents: 'Incidentes por Severidade (Últimos 12 meses)',
    chart_trends: 'Tendência por Domínio',
    chart_historical: 'Histórico',
    chart_prediction: 'Predição',
    loading_data: 'Carregando dados...',
    error_loading: 'Erro ao carregar dados.',
    kpi_on_target: 'KPIs no Alvo',
    kpi_missed: 'KPIs Fora do Alvo',
    kri_ok: 'KRIs OK',
    kri_alert: 'KRIs em Alerta',
    // Docs page
    section_docs: 'DOCUMENTAÇÃO',
    sidebar_exec_scores: '📊 Executive Scores',
    sidebar_methodology: '🔢 Metodologia',
    exec_scores_title: 'Executive Scores — Composição',
    methodology_title: 'Metodologia de Cálculo',
    formula_higher: 'Indicadores higher_better (KPIs)',
    formula_lower: 'Indicadores lower_better (KRIs)',
    formula_zero: 'Indicadores com target = 0',
    status_legend: 'Legenda de Status',
    status_green: 'Verde ≥ 85% — No Alvo',
    status_gold: 'Amarelo 50-84% — Atenção',
    status_red: 'Vermelho < 50% — Alerta',
    contributors: 'Domínios Contribuintes',
    key_indicators: 'Indicadores-Chave',
    indicator_count: 'indicadores',
    methodology_reference: 'Referências',
    scores_fed: 'Scores Alimentados',
    formula_label: 'Fórmula',
    rationale_label: 'Por Que Importa'
  },
  en: {
    nav_dashboard: 'Dashboard',
    nav_analytics: 'Analytics',
    nav_docs: 'Documentation',
    nav_admin: 'Admin',
    header_title: 'Cyber Risk Command Center',
    header_subtitle: 'Executive Cybersecurity Dashboard',
    login_title: 'Sign In',
    login_email: 'Email',
    login_password: 'Password',
    login_btn: 'Sign In',
    login_no_account: 'No account?',
    login_register_link: 'Register',
    login_error: 'Incorrect email or password.',
    login_locked: 'Account locked. Try again in 15 minutes.',
    register_title: 'Create Account',
    register_name: 'Full name',
    register_email: 'Email',
    register_password: 'Password',
    register_confirm: 'Confirm password',
    register_btn: 'Create account',
    register_have_account: 'Have an account?',
    register_login_link: 'Sign In',
    register_error_exists: 'Email already registered.',
    register_error_mismatch: 'Passwords do not match.',
    register_error_weak: 'Weak password: min 8 chars, one uppercase letter and one number.',
    register_success: 'Account created! Redirecting...',
    register_password_hint: 'Min 8 chars, one uppercase letter and one number',
    logout_btn: 'Logout',
    welcome_user: 'Hello,',
    admin_title: 'Manage Indicators',
    admin_save: 'Save Changes',
    admin_reset: 'Reset to Defaults',
    admin_export: 'Export JSON',
    admin_import: 'Import JSON',
    admin_saved: 'Saved successfully!',
    admin_reset_confirm: 'Reset to defaults? All edits will be lost.',
    admin_metadata: 'Metadata',
    admin_period: 'Period',
    admin_last_updated: 'Last Updated',
    section_executive: 'EXECUTIVE SUMMARY',
    on_target: 'On Target',
    warning: 'Warning',
    alert: 'Alert',
    hygiene_score: 'Hygiene Score',
    resilience_score: 'Resilience Score',
    human_score: 'Human Score',
    risk_score: 'Risk Score',
    hygiene_subtitle: 'Preventive Controls',
    resilience_subtitle: 'Response Capability',
    human_subtitle: 'Security Culture',
    risk_subtitle: 'Risk Exposure',
    total_indicators: 'Total Indicators',
    kpis_on_target: 'KPIs On Target',
    kris_in_alert: 'KRIs In Alert',
    improvements: 'Improvements',
    period: 'Period',
    search_placeholder: 'Search indicator...',
    filter_all: 'ALL',
    toggle_improvements: '🚀 Improvements',
    badge_kpi: 'KPI',
    badge_kri: 'KRI',
    badge_improvement: '🚀 IMPROVEMENT',
    score_label: 'Score',
    target_label: 'Target',
    value_label: 'Value',
    why_matters: 'Why it matters',
    scores_feeds: 'Feeds into',
    section_improvements: 'ROADMAP IMPROVEMENTS',
    no_results: 'No indicators found.',
    footer_created: 'Created by Arthur Paixao',
    section_analytics: 'ANALYTICS',
    chart_exec_scores: 'Executive Scores Evolution',
    chart_domain_health: 'Domain Health',
    chart_kpi_kri: 'KPI/KRI Distribution',
    chart_compliance: 'Compliance by Domain (%)',
    chart_annual: 'Annual Scores by Category',
    chart_incidents: 'Incidents by Severity (Last 12 months)',
    chart_trends: 'Domain Trend',
    chart_historical: 'Historical',
    chart_prediction: 'Prediction',
    loading_data: 'Loading data...',
    error_loading: 'Error loading data.',
    kpi_on_target: 'KPIs On Target',
    kpi_missed: 'KPIs Off Target',
    kri_ok: 'KRIs OK',
    kri_alert: 'KRIs In Alert',
    section_docs: 'DOCUMENTATION',
    sidebar_exec_scores: '📊 Executive Scores',
    sidebar_methodology: '🔢 Methodology',
    exec_scores_title: 'Executive Scores — Composition',
    methodology_title: 'Calculation Methodology',
    formula_higher: 'higher_better indicators (KPIs)',
    formula_lower: 'lower_better indicators (KRIs)',
    formula_zero: 'Indicators with target = 0',
    status_legend: 'Status Legend',
    status_green: 'Green ≥ 85% — On Target',
    status_gold: 'Yellow 50-84% — Warning',
    status_red: 'Red < 50% — Alert',
    contributors: 'Contributing Domains',
    key_indicators: 'Key Indicators',
    indicator_count: 'indicators',
    methodology_reference: 'References',
    scores_fed: 'Scores Fed',
    formula_label: 'Formula',
    rationale_label: 'Why It Matters'
  },
  es: {
    nav_dashboard: 'Dashboard',
    nav_analytics: 'Analytics',
    nav_docs: 'Documentación',
    nav_admin: 'Admin',
    header_title: 'Cyber Risk Command Center',
    header_subtitle: 'Panel Ejecutivo de Ciberseguridad',
    login_title: 'Iniciar Sesión',
    login_email: 'Correo',
    login_password: 'Contraseña',
    login_btn: 'Entrar',
    login_no_account: '¿Sin cuenta?',
    login_register_link: 'Regístrese',
    login_error: 'Correo o contraseña incorrectos.',
    login_locked: 'Cuenta bloqueada. Intente en 15 minutos.',
    register_title: 'Crear Cuenta',
    register_name: 'Nombre completo',
    register_email: 'Correo',
    register_password: 'Contraseña',
    register_confirm: 'Confirmar contraseña',
    register_btn: 'Crear cuenta',
    register_have_account: '¿Ya tiene cuenta?',
    register_login_link: 'Entrar',
    register_error_exists: 'Correo ya registrado.',
    register_error_mismatch: 'Las contraseñas no coinciden.',
    register_error_weak: 'Contraseña débil: mín 8 chars, una mayúscula y un número.',
    register_success: '¡Cuenta creada! Redirigiendo...',
    register_password_hint: 'Mín 8 caracteres, una mayúscula y un número',
    logout_btn: 'Cerrar Sesión',
    welcome_user: 'Hola,',
    admin_title: 'Gestionar Indicadores',
    admin_save: 'Guardar Cambios',
    admin_reset: 'Restaurar Valores',
    admin_export: 'Exportar JSON',
    admin_import: 'Importar JSON',
    admin_saved: '¡Guardado con éxito!',
    admin_reset_confirm: '¿Restaurar? Se perderán todos los cambios.',
    admin_metadata: 'Metadatos',
    admin_period: 'Período',
    admin_last_updated: 'Última Actualización',
    section_executive: 'RESUMEN EJECUTIVO',
    on_target: 'En Meta',
    warning: 'Atención',
    alert: 'Alerta',
    hygiene_score: 'Hygiene Score',
    resilience_score: 'Resilience Score',
    human_score: 'Human Score',
    risk_score: 'Risk Score',
    hygiene_subtitle: 'Controles Preventivos',
    resilience_subtitle: 'Capacidad de Respuesta',
    human_subtitle: 'Cultura de Seguridad',
    risk_subtitle: 'Exposición al Riesgo',
    total_indicators: 'Total Indicadores',
    kpis_on_target: 'KPIs en Meta',
    kris_in_alert: 'KRIs en Alerta',
    improvements: 'Mejoras',
    period: 'Período',
    search_placeholder: 'Buscar indicador...',
    filter_all: 'TODOS',
    toggle_improvements: '🚀 Mejoras',
    badge_kpi: 'KPI',
    badge_kri: 'KRI',
    badge_improvement: '🚀 MEJORA',
    score_label: 'Score',
    target_label: 'Meta',
    value_label: 'Valor',
    why_matters: 'Por qué importa',
    scores_feeds: 'Alimenta',
    section_improvements: 'MEJORAS EN ROADMAP',
    no_results: 'No se encontraron indicadores.',
    footer_created: 'Creado por Arthur Paixao',
    section_analytics: 'ANALYTICS',
    chart_exec_scores: 'Evolución de Executive Scores',
    chart_domain_health: 'Salud por Dominio',
    chart_kpi_kri: 'Distribución KPI/KRI',
    chart_compliance: 'Cumplimiento por Dominio (%)',
    chart_annual: 'Scores Anuales por Categoría',
    chart_incidents: 'Incidentes por Severidad (Últimos 12 meses)',
    chart_trends: 'Tendencia por Dominio',
    chart_historical: 'Histórico',
    chart_prediction: 'Predicción',
    loading_data: 'Cargando datos...',
    error_loading: 'Error al cargar datos.',
    kpi_on_target: 'KPIs en Meta',
    kpi_missed: 'KPIs Fuera de Meta',
    kri_ok: 'KRIs OK',
    kri_alert: 'KRIs en Alerta',
    section_docs: 'DOCUMENTACIÓN',
    sidebar_exec_scores: '📊 Executive Scores',
    sidebar_methodology: '🔢 Metodología',
    exec_scores_title: 'Executive Scores — Composición',
    methodology_title: 'Metodología de Cálculo',
    formula_higher: 'Indicadores higher_better (KPIs)',
    formula_lower: 'Indicadores lower_better (KRIs)',
    formula_zero: 'Indicadores con target = 0',
    status_legend: 'Leyenda de Estado',
    status_green: 'Verde ≥ 85% — En Meta',
    status_gold: 'Amarillo 50-84% — Atención',
    status_red: 'Rojo < 50% — Alerta',
    contributors: 'Dominios Contribuyentes',
    key_indicators: 'Indicadores Clave',
    indicator_count: 'indicadores',
    methodology_reference: 'Referencias',
    scores_fed: 'Scores Alimentados',
    formula_label: 'Fórmula',
    rationale_label: 'Por Qué Importa'
  }
};

function getLang() {
  return localStorage.getItem('crcc_lang') || 'pt';
}

function setLang(lang) {
  localStorage.setItem('crcc_lang', lang);
}

function t(key) {
  const lang = getLang();
  return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) ||
         (TRANSLATIONS['pt'] && TRANSLATIONS['pt'][key]) ||
         key;
}

function applyLang(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translation = (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) ||
                        (TRANSLATIONS['pt'] && TRANSLATIONS['pt'][key]) || key;
    if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
      el.placeholder = translation;
    } else {
      el.textContent = translation;
    }
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const translation = (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) ||
                        (TRANSLATIONS['pt'] && TRANSLATIONS['pt'][key]) || key;
    el.placeholder = translation;
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

function renderLangSwitcher(containerId) {
  const id = containerId || 'lang-switcher';
  const container = document.getElementById(id);
  if (!container) return;

  const langs = [
    { code: 'pt', flag: '🇧🇷', label: 'PT' },
    { code: 'en', flag: '🇺🇸', label: 'EN' },
    { code: 'es', flag: '🇪🇸', label: 'ES' }
  ];

  container.innerHTML = langs.map(l => `
    <button class="lang-btn${getLang() === l.code ? ' active' : ''}" data-lang="${l.code}" title="${l.label}">
      ${l.flag} ${l.label}
    </button>
  `).join('');

  container.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      setLang(lang);
      applyLang(lang);
      document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
    });
  });
}

// ── Shared score calculation ───────────────────────────────────────────────────
function calcPct(indicator) {
  const { direction, target, warningThreshold, value } = indicator;
  if (value == null) return null;
  if (direction === 'higher_better') {
    return Math.min(100, (value / target) * 100);
  }
  if (target === 0) {
    if (!warningThreshold) return value === 0 ? 100 : 0;
    return Math.max(0, 100 - (value / warningThreshold) * 100);
  }
  if (value <= target) return 100;
  return Math.max(0, 100 - ((value - target) / target * 100));
}

function getStatus(pct) {
  if (pct === null) return 'unknown';
  if (pct >= 85) return 'green';
  if (pct >= 50) return 'gold';
  return 'red';
}

function getStatusColor(pct) {
  if (pct === null) return '#8B949E';
  if (pct >= 85) return '#3FB950';
  if (pct >= 50) return '#D29922';
  return '#F85149';
}

function getStatusLabel(pct) {
  if (pct === null) return '—';
  if (pct >= 85) return t('on_target');
  if (pct >= 50) return t('warning');
  return t('alert');
}

// ── Shared UI helpers ─────────────────────────────────────────────────────────

/** Populate #user-greeting on any page */
function updateUserGreeting() {
  const name = getCurrentUser();
  document.querySelectorAll('#user-greeting').forEach(el => {
    el.textContent = name ? t('welcome_user') + ' ' + name : '';
  });
}

/** Show admin-only nav links only for users with admin role */
function applyRoleGating() {
  const isAdmin = getCurrentRole() === 'admin';
  document.querySelectorAll('.admin-only').forEach(el => {
    el.style.display = isAdmin ? '' : 'none';
  });
}

// ── Auto-initialize on DOMContentLoaded ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderLangSwitcher('lang-switcher');
  applyLang(getLang());
  updateUserGreeting();
  applyRoleGating();
});

// Re-run greeting on language change (t('welcome_user') changes)
document.addEventListener('langchange', () => {
  updateUserGreeting();
});
