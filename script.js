"use strict";

const date = `${new Date().getDate()}/${String(
  new Date().getMonth() + 1
).padStart(2, "0")}/${new Date().getFullYear()}`;

const notesContainer = document.querySelector(`.notes--container`);
const colorsContainer = document.querySelector(`.colors`);
const newNoteBtn = document.querySelector(`.btn--new-note`);
const displayRemoveAllBtn = document.querySelector(`.btn--display-remove-all`);
const removeAllBtn = document.querySelector(`.btn--remove-all`);
const backBtn = document.querySelector(`.btn--back`);

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

const accept = function (index) {
  addData(index);
  if (!stage.data) return;
  renderNotes();
  state.input = false;
};

const important = function (index) {
  let starIcon = document.querySelector(`.ph-star`);

  if (index === undefined) {
    stage.important ? (stage.important = false) : (stage.important = true);
    stage.important === true
      ? starIcon.classList.replace(`ph`, `ph-fill`)
      : starIcon.classList.replace(`ph-fill`, `ph`);
  }

  if (index != undefined) {
    const active = document.querySelector(`#imp-${index}`);
    stage.important ? (stage.important = false) : (stage.important = true);
    stage.important === true
      ? active.classList.replace(`ph`, `ph-fill`)
      : active.classList.replace(`ph-fill`, `ph`);
    edit(index);
  }
};

const reject = function () {
  document.querySelector(`.note--input`).remove();
  state.input = false;
  renderNotes();
};

const edit = function (index) {
  if (state.input) return;
  const active = notes.find((el) => el.id === index);
  stage.id = active.id;
  stage.data = active.data;
  stage.color = active.color;
  stage.important = active.important;
  stage.time = active.time;
  state.input = true;
  renderNotes(index);
};

const remove = function (index) {
  if (state.input) return;
  const active = notes.find((el) => el.id === index);
  let removed = notes.filter((el) => el != active);
  notes = removed;
  localStorage.setItem(`notes`, JSON.stringify(notes));
  renderNotes();
};

const addData = function (index) {
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
};

const renderNotes = function (index = ``) {
  document.querySelectorAll(`.note`).forEach((el) => el.remove());
  notes.forEach((el) => {
    const note = `<div id="${el.id}" class="note note--color-${el.color}">
            <div class="note__data">${el.data}</div>
            <div class="note__footer">
              <div class="note__footer--date">${el.time}</div>
              <div class="note__footer--buttons">
                <button type="button" class="note__marker ${
                  el.important ? `` : `hidden`
                }">
  <i class="icon ph-fill ph-star"></i>
</button>
                <button
                  type="button"
                  onclick="remove(${el.id})"
                  class="btn btn--remove"
                >
                  <i class="icon ph ph-trash"></i>
                </button>
                <button
                  type="button"
                  onclick="edit(${el.id})"
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
      autofocus
    >
${el.data}</textarea
    >
  </form>
  <div class="note__footer">
    <div class="note__input-footer--buttons">
      <button type="button" onclick="reject()" class="btn btn--reject">
        <i class="icon ph-bold ph-x"></i>
      </button>
      <div class="buttons__container">
  <button id="${el.id}" type="button" onclick="important(${
      el.id
    })" class="btn btn--important">
    <i id="imp-${el.id}" class="icon ph${
      el.important ? `-fill` : ``
    } ph-star" ></i>
  </button>
  <button type="button" onclick="accept(${el.id})" class="btn btn--accept">
    <i class="icon ph ph-check"></i>
  </button>
</div>
    </div>
  </div>
</div>`;

    notesContainer.insertAdjacentHTML(
      `afterbegin`,
      index === el.id ? inputNote : note
    );
  });
};

const renderInputNote = function () {
  if (state.input) return;
  state.input = true;
  stage.color = Math.floor(Math.random() * 5) + 1;
  stage.important = false;

  const inputNote = document.createElement(`div`);
  inputNote.classList.add(`note`, `note--input`, `note--color-${stage.color}`);
  inputNote.innerHTML = `<form>
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
            </div>`;

  notesContainer.insertBefore(inputNote, document.querySelector(`.note`));

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
};

// window.addEventListener(`click`, function (event) {
//   console.log(event.target);
//   if (!state.remove && event.target) return;
//   displayRemoveAll();
// });

const displayRemoveAll = function () {
  state.remove = true;
  displayRemoveAllBtn.classList.toggle(`hidden`);
  removeAllBtn.classList.toggle(`hidden`);
  backBtn.classList.toggle(`hidden`);
};

const removeAll = function () {
  notes = [];
  localStorage.setItem(`notes`, JSON.stringify(notes));
  renderNotes();
  state.input = false;
  displayRemoveAll();
};

const back = function () {
  displayRemoveAll();
  state.remove = false;
};

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

window.addEventListener(`load`, function () {
  renderNotes();
});

newNoteBtn.addEventListener(`click`, function () {
  renderInputNote();
});

displayRemoveAllBtn.addEventListener(`click`, function () {
  displayRemoveAll();
});

removeAllBtn.addEventListener(`click`, function () {
  removeAll();
});

backBtn.addEventListener(`click`, function () {
  back();
});
