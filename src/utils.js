import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export class FormateerGetallen {
  static valuta(getal) {
    let g = new Intl.NumberFormat("nl", { style: "currency", currency: "EUR" }).format(getal);
    return g;
  }

  static percentageGeenDecimalen(getal) {
    let b = new Intl.NumberFormat("nl", { style: "percent", maximumFractionDigits: 0 }).format(getal);
    return b;
  }

  static decimalen4(getal) {
    let b = new Intl.NumberFormat("nl", { minimumFractionDigits: 4 }).format(getal);
    return b;
  }

  static decimalen2(getal) {
    let b = new Intl.NumberFormat("nl", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(getal);
    return b;
  }

  static percentage(getal) {
    let b = new Intl.NumberFormat("nl", { style: "percent", maximumFractionDigits: 2 }).format(getal);
    return b;
  }

  static decimalen8(getal) {
    let b = new Intl.NumberFormat("nl", { minimumFractionDigits: 8, maximumFractionDigits: 8 }).format(getal);
    return b;
  }

  static decimalen6(getal) {
    let b = new Intl.NumberFormat("nl", { minimumFractionDigits: 6, maximumFractionDigits: 6 }).format(getal);
    return b;
  }

  static decimalenKeuze(getal, decimalen) {
    let b = new Intl.NumberFormat("nl", { minimumFractionDigits: decimalen, maximumFractionDigits: decimalen }).format(getal);
    return b;
  }
}

export function formatInput(element, type = "fte") {
  let rawValue = element.value;

  // normaliseren voor NL-notatie
  rawValue = rawValue
    .replace(/\s/g, "")     // spaties
    .replace("€", "")       // euroteken
    // .replace(/\./g, "")     // duizendtallen
    .replace(",", ".");     // decimaal

  const numberValue = parseFloat(rawValue);

  if (isNaN(numberValue)) {
    element.value = "";
    return;
  }

  if (type === "fte") {
    element.value = numberValue.toFixed(4).replace(".", ",");
  } else if (type === "valuta") {
    element.value = FormateerGetallen.valuta(numberValue);
  } else if (type === "getal") {
      element.value = FormateerGetallen.decimalen2(numberValue);
  }
}


class Toast {
  static base(options = {}) {
    return Toastify({
      duration: 3000,
      gravity: "top",
      position: "right",
      close: true,
      stopOnFocus: true,
      ...options,
    });
  }

  static success(text, duration = 3000) {
    return this.base({
      text,
      duration,
      style: {
        background: "Green",
      },
    }).showToast();
  }

  static error(text, duration = 3000) {
    return this.base({
      text,
      duration,
      style: {
        background: "red",
      },
    }).showToast();
  }

  static warning(text, duration = 3000) {
    return this.base({
      text,
      duration,
      style: {
        background: "orange",
      },
    }).showToast();
  }
}

export default Toast;

function getalOpschonen(value) {
   if (value === "") return "";   // leeg mag leeg blijven
    if (value === null || value === undefined) return null;

    const cleaned = value
        .replace(/\./g, '')   
        .replace(',', '.');   

    const number = Number(cleaned);

    return isNaN(number) ? null : number;
}


export function checkInput(input) {
  const schoonGetal = getalOpschonen(input)
    if (schoonGetal === null || schoonGetal === "" || isNaN(schoonGetal)) return false
    return true
}

export function checkInputLeegMag(input) {
   if (input === "") return true;   // leeg is toegestaan

    const schoonGetal = getalOpschonen(input);

    if (schoonGetal === null || isNaN(schoonGetal)) return false;

    return true;
}

let privacyStatementHidden = true;
export function privacyStatementToggle() {
if (privacyStatementHidden) {
    document.getElementById("privacy-statement").classList.remove("hidden");
    privacyStatementHidden = false;
  } else {
    document.getElementById("privacy-statement").classList.add("hidden");
    privacyStatementHidden = true;
  }
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
} 