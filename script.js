/* ----- VARIABLES --- */

const date = `${new Date().getDate()}/${String(
  new Date().getMonth() + 1
).padStart(2, "0")}/${new Date().getFullYear()}`;

const notesContainer = document.querySelector(`.notes__container`);
const colorsContainer = document.querySelector(`.navigation__colors`);
const newNoteBtn = document.querySelector(`.btn--new-note`);
const displayRemoveAllBtn = document.querySelector(`.btn--display-remove-all`);
const removeAllBtn = document.querySelector(`.btn--remove-all`);
const backBtn = document.querySelector(`.btn--back`);

/* ----- APP STATE ----- */

let notes = JSON.parse(localStorage.getItem(`notes`) || `[]`);

const state = {
  input: false,
  remove: false,
};

const stage = {
  id: ``,
  data: ``,
  color: ``,
  important: false,
  time: ``,
};

/* ----- INPUT NOTE ----- */

function reject() {
  state.input = false;
  renderNotes();
}

function important(index) {
  let starIcon = document.querySelector(`.ph-star`);

  if (index === undefined) {
    stage.important ? (stage.important = false) : (stage.important = true);
    stage.important
      ? starIcon.classList.replace(`ph`, `ph-fill`)
      : starIcon.classList.replace(`ph-fill`, `ph`);
  }

  if (index != undefined) {
    const active = document.querySelector(`#imp-${index}`);
    stage.important ? (stage.important = false) : (stage.important = true);
    stage.important
      ? active.classList.replace(`ph`, `ph-fill`)
      : active.classList.replace(`ph-fill`, `ph`);
    edit(index);
  }
}

function accept(index) {
  addData(index);
  if (!stage.data) return;
  renderNotes();
  state.input = false;
}

function addData(index) {
  stage.id = Date.now();
  stage.data = document.querySelector(`.input`).value;
  stage.time = date;

  if (!stage.data) return;

  let note = null;

  if (index === undefined) {
    note = {
      id: stage.id,
      data: stage.data,
      color: stage.color,
      important: stage.important,
      time: stage.time,
    };
  } else {
    note = notes.find((el) => el.id === index);
    note.data = stage.data;
    note.color = stage.color;
    note.important = stage.important;
  }

  if (index === undefined) {
    notes.push(note);
  } else {
    notes[notes.indexOf(notes.find((el) => el.id === index))] = note;
  }

  localStorage.setItem(`notes`, JSON.stringify(notes));
  document.querySelector(`.note--input`).remove();
}

/* ----- NOTE ----- */

function remove(index) {
  if (state.input) return;
  const active = notes.find((el) => el.id === index);
  let remaining = notes.filter((el) => el != active);
  notes = remaining;
  localStorage.setItem(`notes`, JSON.stringify(notes));
  renderNotes();
}

function edit(index) {
  if (state.input) return;
  const active = notes.find((el) => el.id === index);
  stage.id = active.id;
  stage.data = active.data;
  stage.color = active.color;
  stage.important = active.important;
  stage.time = active.time;
  state.input = true;
  renderNotes(index);
}

/* ----- NOTES FUNCTIONS ----- */

function renderInputNote() {
  if (state.input) return;
  state.input = true;
  stage.color = Math.floor(Math.random() * 5) + 1;
  stage.important = false;

  const inputNote = `
<div class="note note--input note--color-${stage.color}">
  <form>
    <textarea
      class="input color-${stage.color}"
      rows="8"
      cols="30"
      maxlength="200"
      spellcheck="false"
      autofocus
      placeholder="What's on your mind?"
    ></textarea>
    </form>
    <div class="note__footer">
      <div class="note__input-footer--buttons">
        <button type="button" class="btn btn--reject">
         <i class="icon ph-bold ph-x"></i>
        </button>
      <div class="buttons__container">
        <button type="button" class="btn btn--important">
          <i id="test" class="icon ph ph-star"></i>
        </button>
        <button type="button" class="btn btn--accept">
          <i class="icon ph-bold ph-check"></i>
        </button>
      </div>
    </div>
  </div>
</div>
  `;

  notesContainer.insertAdjacentHTML(`afterbegin`, inputNote);

  const rejectBtn = document.querySelector(`.btn--reject`);
  const importantBtn = document.querySelector(`.btn--important`);
  const acceptBtn = document.querySelector(`.btn--accept`);
  rejectBtn.addEventListener(`click`, function () {
    reject();
  });
  importantBtn.addEventListener(`click`, function () {
    important();
  });
  acceptBtn.addEventListener(`click`, function () {
    accept();
  });
}

function renderNotes(index = ``) {
  document.querySelectorAll(`.note`).forEach((el) => el.remove());
  notes.forEach((el) => {
    const noteID = el.id;
    const noteData = el.data;
    const noteColor = el.color;
    const noteTime = el.time;
    const noteImportant = el.important;

    const note = `
<div id="${noteID}" class="note note--color-${noteColor}">
  <div class="note__data">${noteData}</div>
  <div class="note__footer">
    <div class="note__footer--date">${noteTime}</div>
    <div class="note__footer--buttons">
      <button type="button" class="note__marker ${
        noteImportant ? `` : `hidden`
      }">
        <i i class="icon ph-fill ph-star"></i>
      </button>
      <button
        type="button"
        class="btn btn--remove"
      >
        <i class="icon ph ph-trash"></i>
      </button>
      <button
        type="button"
        class="btn btn--edit"
        >
          <i class="icon ph ph-pencil-simple"></i>
      </button>
    </div>
  </div>
</div>`;

    const inputNote = `
<div class="note note--input note--color-${stage.color}">
  <form>
    <textarea
      class="input color-${stage.color}"
      rows="8"
      cols="30"
      maxlength="200"
      spellcheck="false"
      placeholder="What's on your mind?"
      autofocus>${noteData}</textarea>
  </form>
  <div class="note__footer">
    <div class="note__input-footer--buttons">
      <button type="button" class="btn btn--reject">
        <i class="icon ph-bold ph-x"></i>
      </button>
      <div class="buttons__container">
        <button id="${noteID}" type="button" class="btn btn--important">
          <i
            id="imp-${noteID}"
            class="icon ph${noteImportant ? `-fill` : ``} ph-star"
          ></i>
        </button>
        <button type="button" class="btn btn--accept">
          <i class="icon ph ph-check"></i>
        </button>
      </div>
    </div>
  </div>
</div>`;

    notesContainer.insertAdjacentHTML(
      `afterbegin`,
      index === noteID ? inputNote : note
    );

    if (index === noteID) {
      const rejectBtn = document.querySelector(`.btn--reject`);
      const importantBtn = document.querySelector(`.btn--important`);
      const acceptBtn = document.querySelector(`.btn--accept`);
      rejectBtn.addEventListener(`click`, function () {
        reject();
      });
      importantBtn.addEventListener(`click`, function () {
        important(noteID);
      });
      acceptBtn.addEventListener(`click`, function () {
        accept(noteID);
      });
    } else {
      const removeBtn = document.querySelector(`.btn--remove`);
      const editBtn = document.querySelector(`.btn--edit`);
      removeBtn.addEventListener(`click`, function () {
        remove(noteID);
      });
      editBtn.addEventListener(`click`, function () {
        edit(noteID);
      });
    }
  });
}

/* ----- NAVIGATION FUNCTIONS ----- */

function displayRemoveAll() {
  state.remove = true;
  displayRemoveAllBtn.classList.toggle(`hidden`);
  removeAllBtn.classList.toggle(`hidden`);
  backBtn.classList.toggle(`hidden`);
}

function removeAll() {
  notes = [];
  localStorage.setItem(`notes`, JSON.stringify(notes));
  renderNotes();
  state.input = false;
  displayRemoveAll();
}

function back() {
  displayRemoveAll();
  state.remove = false;
}

/* ----- EVENT LISTENERS ----- */

window.addEventListener(`load`, renderNotes);

colorsContainer.addEventListener(`click`, function (event) {
  let target = event.target.closest(`button`);
  if (event.target != target) return;
  const color = target.classList.value.slice(-7);
  const inputNote = document.querySelector(`.note--input`);
  const input = document.querySelector(`.input`);
  if (!inputNote) return;
  input.classList.value = `input ${color}`;
  inputNote.classList.value = `note note--input note--${color}`;
  stage.color = color.slice(-1);
});

newNoteBtn.addEventListener(`click`, renderInputNote);

displayRemoveAllBtn.addEventListener(`click`, displayRemoveAll);

removeAllBtn.addEventListener(`click`, removeAll);

backBtn.addEventListener(`click`, back);
