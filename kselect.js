var baseComp = Class.inherits(HTMLElement, {
  _style: [
    ":host span, :host div{ ",
    "  border: #9E9E9E 1px outset;",
    "  background-color: #dedede;",
    "  border-radius: 3px;",
    "  padding: 3px;",
    "  cursor: pointer;",
    "}",
    ":host div[show]{ ",
    "  margin-top: 5px;",
    "  position: absolute;",
    "  display: list-item;",
    "}",
    ":host div[hide]{ ",
    "  display: none",
    "}",
    ":host option{ ",
    "  display: block;",
    "}",
    ":host option:hover{ ",
    "  display: block;",
    "  background-color: #b4b4b4;",
    "}",
  ].join(""),
  _template: [
    "<span>",
    "  <def></def>",
    "  <i>&#x25bc;</i>",
    "</span>",
    "<div hide></div>"
  ].join(""),
  _shadow: null,
  _selectedNode: null,
  attachedCallback: function() {
    this.createShadow();
    this.loadElements();
    this.addEvents();
  },
  loadElements: function() {
    var options = this.querySelectorAll("option");
    for (var i = 0; i < options.length; i++) {
      options[i].addEventListener("click", this.handleClickOption.bind(this));
      this._shadow.querySelector("div").appendChild(options[i]);
    }
  },
  createShadow: function() {
    this._shadow = this.attachShadow({
      mode: "open"
    });
    this._shadow.innerHTML += "<style>" + this._style + "</style>";
    this._shadow.innerHTML += this._template;
    this.setValue();
  },
  setValue: function(selected) {
    this._selectedNode = selected || this.querySelector("option");
    var def = this._shadow.querySelector("def");
    def.innerHTML = this._selectedNode.innerHTML;
    this.value = this._selectedNode.innerHTML;
  },
  handleClickListener: function(e) {
    e.stopPropagation();
    this._shadow.querySelector("div").removeAttribute("hide");
    this._shadow.querySelector("div").setAttribute("show", "");
    this.removeEvents();
  },
  handleClickOutside: function(e) {
    e.stopPropagation();
    this._shadow.querySelector("div").removeAttribute("show");
    this._shadow.querySelector("div").setAttribute("hide", "");
    this.addEvents();
  },
  handleClickOption: function(e) {
    this.setValue(e.target);
    var changeEvent = new Event("change");
    changeEvent.target = Object.create(this);
    this.dispatchEvent(changeEvent);
  },
  removeEvents: function() {
    window.addEventListener("click", this.handleClickOutside.bind(this));
    this.removeEventListener("click", this.handleClickListener);
  },
  addEvents: function() {
    this.addEventListener("click", this.handleClickListener);
    window.removeEventListener("click", this.handleClickOutside.bind(this));
  }
});

document.registerElement("k-select", {
  prototype: new baseComp()
});
