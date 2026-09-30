/* =====================================================================
   Password Strength Indicator - vanilla JavaScript
   ---------------------------------------------------------------------
   How it works (simple steps):
   1. Keep a list of "rules" (8+ characters, uppercase, ...).
   2. Every time the user types, each rule is tested.
   3. The number of passed rules becomes the strength "level" (0 to 5).
   4. The level drives the bar color + filled segments, the strength
      text and the green ticks in the requirements list.
   ===================================================================== */

/* ---------- Grab the elements we need from the page ------------------ */
const passwordInput = document.getElementById('password');
const toggleButton = document.getElementById('togglePassword');
const strengthSection = document.getElementById('strengthSection');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');
const requirementsList = document.getElementById('requirements');
const passwordForm = document.getElementById('passwordForm');
const message = document.getElementById('message');

/* ---------- Strength labels (index = number of passed rules) --------- */
const LEVELS = [
  'Enter a password', // 0 rules passed
  'Very Weak',        // 1 rule passed
  'Weak',             // 2 rules passed
  'Medium',           // 3 rules passed
  'Strong',           // 4 rules passed
  'Very Strong'       // 5 rules passed
];
/* ---------- The rules we check -------------------------------------- */
/* Each rule has a name (matching data-key in the HTML) and a test
   function. The test receives the password and returns true when the
   requirement is satisfied. */
const RULES = [
  {
    name: 'length',
    test: function (value) {
      return value.length >= 8; // at least 8 characters
    }
  },
  {
    name: 'uppercase',
    test: function (value) {
      return /[A-Z]/.test(value); // one uppercase letter A-Z
    }
  },
  {
    name: 'lowercase',
    test: function (value) {
      return /[a-z]/.test(value); // one lowercase letter a-z
    }
  },
  {
    name: 'number',
    test: function (value) {
      return /[0-9]/.test(value); // one number 0-9
    }
  },
  {
    name: 'special',
    test: function (value) {
      return /[^A-Za-z0-9\s]/.test(value); // one special character (! @ # ...)
    }
  }
];
/* ---------- Count how many rules the password passes ---------------- */
/* An empty password always scores 0 ("Enter a password"). */
function getLevel(value) {
  if (value.length === 0) {
    return 0;
  }

  let level = 0;

  RULES.forEach(function (rule) {
    if (rule.test(value)) {
      level++;
    }
  });

  return level;
}

/* ---------- Update the strength bar and the strength text ------------ */
/* The bar has 5 segments: we fill the first "level" segments and set
   data-level on the strength section, so CSS applies the color. */
function updateStrength(value) {
  const level = getLevel(value);

  // 1. Tell CSS which level we are on -> it applies the right color
  //    (the attribute sits on the section so the text and the segments
  //     both inherit the same --strength-color value)
  strengthSection.setAttribute('data-level', level);

  // 2. Show the matching label ("Very Weak", "Strong", ...)
  strengthText.textContent = LEVELS[level];

  // 3. Keep the screen-reader attributes in sync
  strengthBar.setAttribute('aria-valuenow', level);
  strengthBar.setAttribute('aria-valuetext', LEVELS[level]);

  // 4. Fill the segments: the first N get the class "is-filled"
  const segments = strengthBar.querySelectorAll('.bar__segment');

  segments.forEach(function (segment, index) {
    if (index < level) {
      segment.classList.add('is-filled');
    } else {
      segment.classList.remove('is-filled');
    }
  });

  // 5. Refresh the requirements list as well
  updateRequirements(value);
}
/* ---------- Update the requirements list (green ticks) -------------- */
/* For every rule we add or remove the class "is-ok" on its <li>. */
function updateRequirements(value) {
  RULES.forEach(function (rule) {
    // Find the <li> of this rule (data-key="length", "uppercase", ...)
    const item = requirementsList.querySelector('[data-key="' + rule.name + '"]');

    if (!item) {
      return; // safety: skip if the element does not exist
    }

    if (rule.test(value)) {
      item.classList.add('is-ok');    // satisfied -> green text + tick
    } else {
      item.classList.remove('is-ok'); // not satisfied -> grey empty box
    }
  });
}

/* ---------- Main handler: runs on every keystroke -------------------- */
passwordInput.addEventListener('input', function (event) {
  // Strength updates instantly, no page refresh needed
  updateStrength(event.target.value);

  // Hide the old message as soon as the user edits the password again
  hideMessage();
});
/* ---------- Show / hide the password -------------------------------- */
/* We switch the input type between "password" and "text", swap the eye
   icons (CSS does that with the "is-visible" class) and keep the
   aria-label in sync for screen readers. */
toggleButton.addEventListener('click', function () {
  const isHidden = passwordInput.type === 'password';

  if (isHidden) {
    passwordInput.type = 'text';            // show the characters
    toggleButton.classList.add('is-visible');
    toggleButton.setAttribute('aria-pressed', 'true');
    toggleButton.setAttribute('aria-label', 'Hide password');
    toggleButton.title = 'Hide password';
  } else {
    passwordInput.type = 'password';        // hide them again
    toggleButton.classList.remove('is-visible');
    toggleButton.setAttribute('aria-pressed', 'false');
    toggleButton.setAttribute('aria-label', 'Show password');
    toggleButton.title = 'Show password';
  }

  // Keep the focus (and the caret) inside the input field
  passwordInput.focus();
});

/* ---------- Form submit: no page reload ----------------------------- */
passwordForm.addEventListener('submit', function (event) {
  // Stop the browser from sending the form anywhere (there is no backend)
  event.preventDefault();

  const level = getLevel(passwordInput.value);

  if (level === 5) {
    showMessage('Password meets the required strength!', 'success');
  } else if (level >= 3) {
    showMessage('Getting close! Complete the remaining requirements.', 'error');
  } else {
    showMessage('This password is too weak. Please follow the requirements.', 'error');
  }
});
/* ---------- Small helper functions ---------------------------------- */

/* Show a message below the submit button */
function showMessage(text, type) {
  message.textContent = text;
  message.className = 'message show message--' + type;
}

/* Hide the message */
function hideMessage() {
  message.textContent = '';
  message.className = 'message';
}

/* ---------- Initialize the page in its empty state ------------------- */
/* Ensures the bar, the text and the list look correct before typing */
updateStrength('');