'use strict';

const API_URL = "https://cardiosense-heart-health-prediction.onrender.com/";

const NUMERIC_RANGES = {
  age: [18, 100],
  resting_bp: [80, 220],
  max_heart_rate: [60, 220],
  cholesterol: [100, 600],
  oldpeak: [0, 10],
  ca: [0, 3]
};

function $(id) {
  return document.getElementById(id);
}

function getFieldElements() {
  return {
    age: $('age'),
    sex: $('sex'),
    resting_bp: $('resting_bp'),
    max_heart_rate: $('max_heart_rate'),
    cholesterol: $('cholesterol'),
    fasting_blood_sugar: $('fasting_blood_sugar'),
    chest_pain: $('chest_pain'),
    resting_ecg: $('resting_ecg'),
    exercise_angina: $('exercise_angina'),
    oldpeak: $('oldpeak'),
    slope: $('slope'),
    ca: $('ca'),
    Thal: $('thal')
  };
}

function setFieldError(key, message) {
  const el = getFieldElements()[key];
  const errorEl = $(`${key.toLowerCase()}-error`);

  if (el) {
    el.classList.add('field-invalid');
  }

  if (errorEl) {
    errorEl.textContent = message;
  }
}

function clearFieldError(key) {
  const el = getFieldElements()[key];
  const errorEl = $(`${key.toLowerCase()}-error`);

  if (el) {
    el.classList.remove('field-invalid');
  }

  if (errorEl) {
    errorEl.textContent = '';
  }
}

function validateForm() {
  const fields = getFieldElements();
  let isValid = true;

  Object.entries(fields).forEach(([key, el]) => {
    clearFieldError(key);

    if (!el) {
      return;
    }

    const raw = el.value;

    if (raw === null || raw === '') {
      setFieldError(key, 'This field is required.');
      isValid = false;
      return;
    }

    if (el.tagName === 'INPUT') {
      const num = Number(raw);

      if (Number.isNaN(num)) {
        setFieldError(key, 'Enter a valid number.');
        isValid = false;
        return;
      }

      const range = NUMERIC_RANGES[key];

      if (range && (num < range[0] || num > range[1])) {
        setFieldError(
          key,
          `Enter a value between ${range[0]} and ${range[1]}.`
        );

        isValid = false;
      }
    }
  });

  return isValid;
}

function collectFormData() {
  const fields = getFieldElements();

  return {
    age: Number(fields.age.value),
    sex: Number(fields.sex.value),
    chest_pain: Number(fields.chest_pain.value),
    resting_bp: Number(fields.resting_bp.value),
    cholesterol: Number(fields.cholesterol.value),
    fasting_blood_sugar: Number(fields.fasting_blood_sugar.value),
    resting_ecg: Number(fields.resting_ecg.value),
    max_heart_rate: Number(fields.max_heart_rate.value),
    exercise_angina: Number(fields.exercise_angina.value),
    oldpeak: Number(fields.oldpeak.value),
    slope: Number(fields.slope.value),
    ca: Number(fields.ca.value),
    Thal: Number(fields.Thal.value)
  };
}

function setLoadingState(isLoading) {
  const btn = $('submit-btn');
  const label = btn.querySelector('.btn-label');

  btn.disabled = isLoading;
  btn.classList.toggle('is-loading', isLoading);

  label.textContent = isLoading
    ? 'Running Assessment…'
    : 'Run Assessment';
}

function displayResult(data) {
  const resultSection = $('result-section');
  const resultCard = $('result-card');
  const errorCard = $('error-card');
  const message = $('result-message');
  const probabilityValue = $('probability-value');
  const probabilityFill = $('probability-fill');

  const resultText = String(data.result || '');

  const isDiseaseDetected =
    resultText
      .toLowerCase()
      .startsWith('heart disease detected');

  const probability =
    Number(data.disease_probability) || 0;

  const clampedProbability =
    Math.min(Math.max(probability, 0), 100);

  message.textContent = resultText;

  probabilityValue.textContent =
    `${probability.toFixed(2)}%`;

  probabilityFill.style.width =
    `${clampedProbability}%`;

  resultCard.classList.remove(
    'result-warning',
    'result-positive'
  );

  resultCard.classList.add(
    isDiseaseDetected
      ? 'result-warning'
      : 'result-positive'
  );

  errorCard.hidden = true;
  resultCard.hidden = false;
  resultSection.hidden = false;

  resultSection.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

function displayError(message) {
  const resultSection = $('result-section');
  const resultCard = $('result-card');
  const errorCard = $('error-card');

  $('error-message').textContent = message;

  resultCard.hidden = true;
  errorCard.hidden = false;
  resultSection.hidden = false;

  resultSection.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

function resetResult() {
  const resultSection = $('result-section');

  resultSection.hidden = true;

  $('result-card').hidden = false;

  $('error-card').hidden = true;

  $('probability-fill').style.width = '0%';

  $('probability-value').textContent = '';

  $('result-message').textContent = '';

  $('form-status').textContent = '';
}

async function submitAssessment(event) {
  event.preventDefault();

  const formStatus = $('form-status');

  formStatus.textContent = '';

  if (!validateForm()) {

    formStatus.textContent =
      'Please correct the highlighted fields before continuing.';

    const firstInvalid =
      document.querySelector('.field-invalid');

    if (firstInvalid) {
      firstInvalid.focus();
    }

    return;
  }

  const payload = collectFormData();

  setLoadingState(true);

  try {

    const response = await fetch(API_URL, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('api-error');
    }

    const data = await response.json();

    displayResult(data);

  } catch (error) {

    if (error instanceof TypeError) {

      displayError(
        'Unable to connect to the assessment service. Please make sure the FastAPI server is running.'
      );

    } else {

      displayError(
        'Something went wrong while processing the assessment. Please check the entered information and try again.'
      );

    }

  } finally {

    setLoadingState(false);

  }
}

function setupNavToggle() {

  const toggle =
    document.querySelector('.nav-toggle');

  const menu =
    $('nav-menu');

  if (!toggle || !menu) {
    return;
  }

  toggle.addEventListener('click', () => {

    const isOpen =
      menu.classList.toggle('is-open');

    toggle.setAttribute(
      'aria-expanded',
      String(isOpen)
    );

  });

  menu.querySelectorAll('a').forEach((link) => {

    link.addEventListener('click', () => {

      menu.classList.remove('is-open');

      toggle.setAttribute(
        'aria-expanded',
        'false'
      );

    });

  });
}

function init() {

  const form =
    $('assessment-form');

  form.addEventListener(
    'submit',
    submitAssessment
  );

  $('new-assessment-btn').addEventListener(
    'click',
    () => {

      form.reset();

      resetResult();

      form.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

    }
  );

  $('dismiss-error-btn').addEventListener(
    'click',
    () => {

      resetResult();

      form.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

    }
  );

  setupNavToggle();
}

document.addEventListener(
  'DOMContentLoaded',
  init
);