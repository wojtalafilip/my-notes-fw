export const inputStructure = `
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
${noteData}</textarea
    >
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
</div>
`;
