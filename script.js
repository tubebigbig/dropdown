/**
 * 在保留原生select的情況下，與客製化dropdown互動連結，單純改變UI/UX樣式
 * 在使用上不會影響後續element調用，以及form的資料格式
 * 區分dropdown跟myUI是能夠單獨select套用，或是全部select一起套用
 */

/**
 * replace select element from native to customize
 */
class Dropdown {
  _sourceSelectElem;
  _displayElem;
  _optionListElem;

  /**
   * pass in native select element
   * @param {HTMLSelectElement} selectElem
   */
  constructor(selectElem) {
    this._sourceSelectElem = selectElem;
  }

  /**
   * make customize dropdown base on native select element
   * @returns dropdown element
   */
  makeDropdown() {
    const listData = [];
    for (let i = 0; i < this._sourceSelectElem.children.length; i++) {
      const optionElem = this._sourceSelectElem.children[i];
      listData.push({
        text: optionElem.textContent,
        value: optionElem.value,
      });
    }
    const dropdownElem = document.createElement("div");
    dropdownElem.className = "my-ui-select";
    dropdownElem.appendChild(this._makeDisplay());
    dropdownElem.appendChild(this._makeOptionList(listData));
    this._sourceSelectElem.insertAdjacentElement("afterend", dropdownElem);
    this._sourceSelectElem.style.display = "none";
    return dropdownElem;
  }
  /**
   * make dropdown option list
   * @param {Object[]} listData processed option data - { text, value }[]
   * @returns
   */
  _makeOptionList(listData) {
    const listElem = document.createElement("ul");
    listElem.className = "my-ui-dropdown";
    for (let index = 0; index < listData.length; index++) {
      const { text, value } = listData[index];
      const isSelected = this._sourceSelectElem.children[index].selected;
      const _listItem = this._makeOptionItem(text, value, {
        index,
        isSelected,
      });
      listElem.appendChild(_listItem);
    }
    this._optionListElem = listElem;
    return listElem;
  }
  /**
   * make dropdown option list item
   * @param {string} text
   * @param {string} value
   * @param {Object} options
   * @returns option item element
   */
  _makeOptionItem(text, value, options) {
    const { isSelected, index } = options;
    const listItemElem = document.createElement("li");
    const inputElem = document.createElement("input");
    const textNode = document.createTextNode(text);
    const isMultiple = this._sourceSelectElem.multiple;
    inputElem.type = "checkbox";
    inputElem.value = value;
    inputElem.checked = isSelected;
    listItemElem.appendChild(inputElem);
    listItemElem.appendChild(textNode);

    listItemElem.addEventListener("click", () => {
      if (!isMultiple) this._cleanSelect();
      const sourceOption = this._sourceSelectElem.children[index];
      sourceOption.selected = !sourceOption.selected;
      inputElem.checked = sourceOption.selected;

      this._refreshDisplay();
    });
    return listItemElem;
  }
  /**
   * make a display selected result element.
   * @returns display element
   */
  _makeDisplay() {
    const displayElem = document.createElement("div");
    displayElem.className = "my-ui-select-display";
    displayElem.addEventListener("click", () => {
      this._optionListElem.classList.toggle("show");
    });
    this._displayElem = displayElem;
    this._refreshDisplay();

    return displayElem;
  }
  /**
   * clean selected data - only use in non-multiple selection
   */
  _cleanSelect() {
    for (let i = 0; i < this._sourceSelectElem.children.length; i++) {
      const sourceOption = this._sourceSelectElem.children[i];
      sourceOption.selected = false;
      this._optionListElem.children[i].children[0].checked = false;
    }
  }
  /**
   * refresh display state. get all of selected data and display it after processing.
   */
  _refreshDisplay() {
    const selectedText = [];
    for (let i = 0; i < this._sourceSelectElem.children.length; i++) {
      const sourceOption = this._sourceSelectElem.children[i];
      if (!sourceOption.selected) continue;
      selectedText.push(sourceOption.textContent);
    }
    this._displayElem.textContent = selectedText.join(",");
  }
}

const myUI = {
  /**
   * replace all select element from native to customize
   */
  dropdown() {
    const selectElemList = document.querySelectorAll("select");
    for (let i = 0; i < selectElemList.length; i++) {
      new Dropdown(selectElemList[i]).makeDropdown();
    }
  },
};
