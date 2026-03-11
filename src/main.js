import { schalenArray2025_1, witte_tabel_2026 } from "./schalen.js";
import "./style.css";
import { FormateerGetallen, formatInput, checkInput, checkInputLeegMag, privacyStatementToggle, capitalize } from "./utils";
import { naam, adres } from "./pdf.js";
import { bedragen, aov_premies_strings } from "./bedragen";
import Toast from "./utils";
import { printTable, Table } from "console-table-printer";

console.info(
  "%c %cMjepware",
  'padding-left: 36px; line-height: 36px; background-image: url("data:image/gif;base64,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"); background-size: 32px; background-repeat: no-repeat; background-position: 2px 2px; ',
  "background:#D40629; padding:0.2em 0.5em 0.1em 0.5em; border-radius:0.5em; color: white; ",
);

const schalen = schalenArray2025_1;
const schaalDropdown = document.getElementById("schaal-keuze");

const {
  franchise_aop,
  franchise_pensioen,
  premie_aop,
  premie_aop_wg,
  premie_pensioen,
  premie_penioen_wg,
  premie_aov_1,
  premie_aov_2,
  premie_aov_3,
  korting_aov,
  ziektekosten,
  aanvullende_ziektekosten,
  EHBO,
  BHV,
  thuiswerk,
} = bedragen;

const schaalBedragEl = document.getElementById("schaal-bedrag");
const wtfEl = document.getElementById("wtf-input");
const abpJaarinkomenEl = document.getElementById("input-abp-jaarinkomen");
const peildatumEl = document.getElementById("peildatum");

schalen.forEach((schaal) => {
  const option = new Option(schaal.label, schaal.label, false, false);

  // sla salaris op als data attribuut
  option.dataset.salaris = schaal.value;

  $(".schaal-keuze").append(option);
});

$(document).ready(function () {
  $(".schaal-keuze").select2({
    placeholder: "Zoek schaal",
    width: "100%",
  });
});

let basisGegevensOpslaan = true;
let aanvullendeGegevensOpslaan = true;
let brutoElementenOpslaan = true;
let nettoElementenOpslaan = true;
let seniorenverlofOpslaan = true;
let ouderVerlofOpslaan = true;
let onbetaaldVerlofOpslaan = true;

function loadFromLocalStorage() {
  const data = JSON.parse(localStorage.getItem("dataOpslag"));

  if (!data) return;

  document.getElementById("save-data").checked = !!data.invoerOpslaan;

  if (!data.invoerOpslaan) return;
  basisGegevensOpslaan = !!data.invoerBasisgegevens;
  aanvullendeGegevensOpslaan = !!data.invoerAanvullendeGegevens;
  brutoElementenOpslaan = !!data.invoerBrutoElementen;
  seniorenverlofOpslaan = !!data.invoerSeniorenverlof;
  ouderVerlofOpslaan = !!data.invoerOuderVerlof;
  onbetaaldVerlofOpslaan = !!data.invoerOnbetaaldVerlof;

  // BASISGEGEVENS OPHALEN
  schaalDropdown.selectedIndex = basisGegevensOpslaan ? (data.schaal ?? 0) : 0;
  // schaalDropdown.selectedIndex = data.schaal ?? 0;
  wtfEl.value = basisGegevensOpslaan ? (data.wtf ?? 1) : 1;
  peildatumEl.value = basisGegevensOpslaan ? (data.peildatum ?? "") : new Date().toISOString().split("T")[0];
  document.getElementById("inputBasisSalaris").value = basisGegevensOpslaan ? (data.basis_salaris ?? "") : "";

  document.getElementById("peildatum").value = basisGegevensOpslaan ? (data.peildatum ?? "") : new Date().toISOString().split("T")[0];

  // AANVULLENDE GEGEVENS OPHALEN
  abpJaarinkomenEl.value = aanvullendeGegevensOpslaan
    ? (data.abpJaarinkomen ?? jaarinkomenAbpHandmatig())
    : (schaalDropdown.value * (wtfEl.value ?? 1) * 12 * 1.1633).toFixed(2);
  document.getElementById("loonheffingskorting").checked = aanvullendeGegevensOpslaan ? (data.loonheffingskorting ?? true) : true;
  document.getElementById("aov-select").selectedIndex = aanvullendeGegevensOpslaan ? (data.aov ?? 0) : 0;

  // BRUTO ELEMENTEN OPHALEN
  document.getElementById("aanvullende-ziektekosten").checked = aanvullendeGegevensOpslaan ? !!data.aanvullendeZiektekosten : false;
  document.getElementById("ehbo-vergoeding").checked = aanvullendeGegevensOpslaan ? !!data.ehboVergoeding : false;
  document.getElementById("bhv-vergoeding").checked = aanvullendeGegevensOpslaan ? !!data.bhvVergoeding : false;
  document.getElementById("periodieke-vakantietoeslag").checked = aanvullendeGegevensOpslaan ? !!data.periodieke_vakantietoeslag : false;
  document.getElementById("periodieke-eindejaarsuitkering").checked = aanvullendeGegevensOpslaan ? !!data.periodieke_eindejaarsuitkering : false;

  // NETTO ELEMENTEN OPHALEN
  document.getElementById("telefoonvergoeding").checked = nettoElementenOpslaan ? !!data.telefoonvergoeding : false;
  // document.getElementById("wwk-ma").value = nettoElementenOpslaan ? (data.reiskostenWwkMaandag ?? "") : "";
  // document.getElementById("wwk-di").value = nettoElementenOpslaan ? (data.reiskostenWwkDinsdag ?? "") : "";
  // document.getElementById("wwk-wo").value = nettoElementenOpslaan ? (data.reiskostenWwkWoensdag ?? "") : "";
  // document.getElementById("wwk-do").value = nettoElementenOpslaan ? (data.reiskostenWwkDonderdag ?? "") : "";
  // document.getElementById("wwk-vr").value = nettoElementenOpslaan ? (data.reiskostenWwkVrijdag ?? "") : "";
  document.getElementById("input-reiskosten-wwk").value = nettoElementenOpslaan ? (data.reiskostenWwk ?? "") : "";
  document.getElementById("input-thuiswerkvergoeding").value = nettoElementenOpslaan ? (data.thuiswerkVergoeding ?? "") : "";

  // SENIORENVERLOF OPHALEN
  document.querySelector("#select-seniorenverlof").selectedIndex = seniorenverlofOpslaan ? (data.soortSeniorenverlof ?? 0) : 0;
  document.getElementById("input-aangepaste-wtf").value = seniorenverlofOpslaan ? (data.wtfSeniorenverlof ?? "") : "";

  // OUDERVERLOF OPHALEN
  document.querySelector("#select-ouderverlof").selectedIndex = ouderVerlofOpslaan ? (data.soortOuderverlof ?? 0) : 0;
  document.getElementById("input-wtf-ouderverlof").value = ouderVerlofOpslaan ? (data.wtfOuderverlof ?? "") : "";
  document.getElementById("ouderverlof-aangepast-kortingspercentage").value = ouderVerlofOpslaan
    ? (data.ouderverlofAangepastKortingspercentage ?? "")
    : "";

  document.getElementById("keuze-eerst-analyse").checked = data.keuzeAnalyse ?? false;

  // schaalBedragEl.value = schaalDropdown.value;
}

function classVoorOpslag() {
  if (basisGegevensOpslaan) {
    // console.log("basisgegevens opslaan is aan");
    document.querySelector("#basis-gegevens .opslag").classList.add("actief");
    document.querySelector("#basis-gegevens .opslag").classList.remove("inactief");
  } else {
    // console.log("basisgegevens opslaan is uit");
    document.querySelector("#basis-gegevens .opslag").classList.remove("actief");
    document.querySelector("#basis-gegevens .opslag").classList.add("inactief");
  }

  if (aanvullendeGegevensOpslaan) {
    document.querySelector("#aanvullende-gegevens .opslag").classList.add("actief");
    document.querySelector("#aanvullende-gegevens .opslag").classList.remove("inactief");
  } else {
    document.querySelector("#aanvullende-gegevens .opslag").classList.remove("actief");
    document.querySelector("#aanvullende-gegevens .opslag").classList.add("inactief");
  }

  if (brutoElementenOpslaan) {
    document.querySelector("#bruto-elementen .opslag").classList.add("actief");
    document.querySelector("#bruto-elementen .opslag").classList.remove("inactief");
  } else {
    document.querySelector("#bruto-elementen .opslag").classList.remove("actief");
    document.querySelector("#bruto-elementen .opslag").classList.add("inactief");
  }

  if (seniorenverlofOpslaan) {
    document.querySelector("#senioren-verlof .opslag").classList.add("actief");
    document.querySelector("#senioren-verlof .opslag").classList.remove("inactief");
  } else {
    document.querySelector("#senioren-verlof .opslag").classList.remove("actief");
    document.querySelector("#senioren-verlof .opslag").classList.add("inactief");
  }

  if (ouderVerlofOpslaan) {
    document.querySelector("#ouder-verlof .opslag").classList.add("actief");
    document.querySelector("#ouder-verlof .opslag").classList.remove("inactief");
  } else {
    document.querySelector("#ouder-verlof .opslag").classList.remove("actief");
    document.querySelector("#ouder-verlof .opslag").classList.add("inactief");
  }

  if (onbetaaldVerlofOpslaan) {
    document.querySelector("#onbetaald-verlof .opslag").classList.add("actief");
    document.querySelector("#onbetaald-verlof .opslag").classList.remove("inactief");
  } else {
    document.querySelector("#onbetaald-verlof .opslag").classList.remove("actief");
    document.querySelector("#onbetaald-verlof .opslag").classList.add("inactief");
  }
}

loadFromLocalStorage();
classVoorOpslag();

const vandaag = new Date().toISOString().split("T")[0];

// console.log(vandaag);

// peildatumEl.value = vandaag;
const selectedOption = schaalDropdown.options[schaalDropdown.selectedIndex];

let schaalBedrag = selectedOption.dataset.salaris;

$("#schaal-keuze").on("change", function () {
  const selectedOption = this.options[this.selectedIndex];
  const salaris = selectedOption.dataset.salaris;
  console.log(" salaris: ", salaris);
  document.getElementById("inputBasisSalaris").value = salaris;
  bedragenInConsole();
  maandBedragBruto();
  schaalBedrag = salaris;
  document.getElementById("salaris-uit-uren-gewerkt").textContent = FormateerGetallen.valuta(salaris * wtf());
  updateBerekeningen();
});

document.getElementById("inputBasisSalaris").value = selectedOption.dataset.salaris;

const wtf = () => {
  return wtfEl.value ? parseFloat(wtfEl.value.replace(",", ".")) : 0;
};

const normBedrag = () => {
  return parseFloat(schaalBedrag);
};

const maandBedragBruto = () => {
  // console.log("maandbedrag: ", schaalBedrag * wtf());
  return parseFloat(schaalBedrag) * wtf();
};

const maandBedragEl = document.getElementById("salaris-uit-uren-gewerkt");

wtfEl.addEventListener("change", (event) => {
  if (parseFloat(wtfEl.value.replace(",", ".")) > 1.2) {
    Toast.warning(`Klopt de werktijdfactor van ${wtfEl.value} wel? Dat is vrij hoog!`);
    wtfEl.classList.add("sus-input");
  } else {
    wtfEl.classList.remove("sus-input");
  }
  maandBedragEl.textContent = FormateerGetallen.valuta(maandBedragBruto());
  formatInput(wtfEl, "fte");
  updateBerekeningen();
});

const upBtn = document.getElementById("up-btn");
const downBtn = document.getElementById("down-btn");

upBtn.addEventListener("click", () => {
  let currentValue = wtf();
  currentValue += 0.1;
  wtfEl.value = currentValue.toFixed(4).replace(".", ",");
  if (currentValue > 1.299) {
    Toast.warning(`Klopt de werktijdfactor van ${wtfEl.value} wel? Dat is vrij hoog!`);
    wtfEl.classList.add("sus-input");
  } else {
    wtfEl.classList.remove("sus-input");
  }
  maandBedragEl.textContent = FormateerGetallen.valuta(maandBedragBruto());
  bedragenInConsole();
});

downBtn.addEventListener("click", () => {
  console.log(" down-test");
  let currentValue = wtf();
  currentValue -= 0.1;
  wtfEl.value = currentValue.toFixed(4).replace(".", ",");
  if (currentValue > 1.299) {
    Toast.warning(`Klopt de werktijdfactor van ${wtfEl.value} wel? Dat is vrij hoog!`);
    wtfEl.classList.add("sus-input");
  } else {
    wtfEl.classList.remove("sus-input");
  }
  maandBedragEl.textContent = FormateerGetallen.valuta(maandBedragBruto());
  bedragenInConsole();
});

schaalBedragEl.textContent = FormateerGetallen.valuta(schaalBedrag);

maandBedragEl.textContent = FormateerGetallen.valuta(maandBedragBruto());

let abpJaarinkomenVal = checkInput(abpJaarinkomenEl.value) ? abpJaarinkomenEl.value : 0;

const jaarinkomenAbpHandmatig = () => {
  return maandBedragBruto() * 12 * 1.1633;
};

const jaarinkomenAbpHandmatigKnop = document.getElementById("abp-jaarinkomen-berekenen");

jaarinkomenAbpHandmatigKnop.addEventListener("click", () => {
  abpJaarinkomenVal = jaarinkomenAbpHandmatig();
  abpJaarinkomenEl.value = jaarinkomenAbpHandmatig().toFixed(2);
});

// abpJaarinkomenEl.addEventListener("blur", (event) => {
//   if (!checkInputLeegMag(abpJaarinkomenEl.value.replace(",", "."))) {
//     Toast.error("Ongeldige invoer bij ABP Jaarinkomen.");
//     abpJaarinkomenEl.select();
//   } else {
//     abpJaarinkomenVal = abpJaarinkomenEl.value.replace(",", ".");
//     abpJaarinkomenVal = parseFloat(abpJaarinkomenVal);
//     bedragenInConsole();
//   }
// });

const testBtn1 = document.getElementById("test-button-1");

const abpJaarloon = () => {
  if (!checkInput(abpJaarinkomenEl.value)) {
    console.log(" foute abp");
    return 0;
  }
  let abpJaarinkomenVal = abpJaarinkomenEl.value;

  // normaliseren voor NL-notatie
  abpJaarinkomenVal = abpJaarinkomenVal
    .replace(/\s/g, "") // spaties
    .replace("€", "") // euroteken
    // .replace(/\./g, "") // duizendtallen
    .replace(",", "."); // decimaal

  const numberValue = parseFloat(abpJaarinkomenVal);
  return numberValue;
};

const aopBedrag = () => {
  return (((abpJaarloon() - bedragen.franchise_aop) * (bedragen.premie_aop / 100)) / 12) * wtf();
};

const pensioenBedrag = () => {
  return (((abpJaarloon() - bedragen.franchise_pensioen) * (bedragen.premie_pensioen / 100)) / 12) * wtf();
};

const aovBedrag = () => {
  const aov = document.getElementById("aov-select");
  if (aov.selectedIndex === 0) return 0;
  switch (aov.selectedIndex) {
    case 1:
      return ((abpJaarloon() * (premie_aov_1 * (1 - korting_aov))) / 12) * wtf();
    case 2:
      return ((abpJaarloon() * (premie_aov_2 * (1 - korting_aov))) / 12) * wtf();
    case 3:
      return ((abpJaarloon() * (premie_aov_3 * (1 - korting_aov))) / 12) * wtf();
  }
};

const ziektekostenBedrag = () => {
  let korting_seniorenverlofkorting_seniorenverlof = 0;

  if (document.getElementById("select-seniorenverlof").value === "beide") {
    const wtfSen = wtfSeniorenverlof();
    korting_seniorenverlofkorting_seniorenverlof = (wtfSen - 0.10247 * wtf()) * bedragen.ziektekosten;
  }
  return bedragen.ziektekosten * wtf() - korting_seniorenverlofkorting_seniorenverlof - kortingZiektekostenOuderverlof().standaard;
};

const aanvullendeZiektekostenBedrag = () => {
  let korting = 0;
  if (document.getElementById("select-seniorenverlof").value === "beide") {
    const wtfSen = wtfSeniorenverlof();
    korting = (wtfSen - 0.10247 * wtf()) * bedragen.aanvullende_ziektekosten;
  }
  return document.getElementById("aanvullende-ziektekosten").checked
    ? bedragen.aanvullende_ziektekosten * wtf() - korting - kortingZiektekostenOuderverlof().aanvullend
    : 0;
};

const aanvullendeZiektekostenBerekenen = () => {
  return document.getElementById("aanvullende-ziektekosten").checked;
};

const ehboVergoeding = () => {
  return document.getElementById("ehbo-vergoeding").checked ? bedragen.EHBO : 0;
};

const ehboBerekenen = () => {
  return document.getElementById("ehbo-vergoeding").checked;
};

const bhvVergoeding = () => {
  return document.getElementById("bhv-vergoeding").checked ? bedragen.BHV : 0;
};

const bhvBerekenen = () => {
  return document.getElementById("bhv-vergoeding").checked;
};

const brutoVergoeding = () => {
  return document.getElementById("input-bruto-vergoeding").value
    ? parseFloat(document.getElementById("input-bruto-vergoeding").value.replace(",", "."))
    : 0;
};

const brutoVergoedingBerekenen = () => {
  return (
    document.getElementById("input-bruto-vergoeding").value &&
    parseFloat(document.getElementById("input-bruto-vergoeding").value.replace(",", ".")) > 0 &&
    document.getElementById("input-bruto-vergoeding").value !== ""
  );
};

const brutoInhouding = () => {
  return document.getElementById("input-bruto-inhouding").value
    ? parseFloat(document.getElementById("input-bruto-inhouding").value.replace(",", "."))
    : 0;
};

const brutoInhoudingBerekenen = () => {
  return (
    document.getElementById("input-bruto-inhouding").value &&
    parseFloat(document.getElementById("input-bruto-inhouding").value.replace(",", ".")) > 0 &&
    document.getElementById("input-bruto-inhouding").value !== ""
  );
};

const nettoVergoeding = () => {
  return document.getElementById("input-netto-vergoedingen").value
    ? parseFloat(document.getElementById("input-netto-vergoedingen").value.replace(",", "."))
    : 0;
};

const nettoVergoedingBerekenen = () => {
  return (
    document.getElementById("input-netto-vergoedingen").value &&
    parseFloat(document.getElementById("input-netto-vergoeding").value.replace(",", ".")) > 0 &&
    document.getElementById("input-netto-vergoeding").value !== ""
  );
};

const nettoInhoudingen = () => {
  return document.getElementById("input-netto-inhoudingen").value
    ? parseFloat(document.getElementById("input-netto-inhoudingen").value.replace(",", "."))
    : 0;
};

const nettoInhoudingBerekenen = () => {
  return (
    document.getElementById("input-netto-inhoudingen").value &&
    parseFloat(document.getElementById("input-netto-inhoudingen").value.replace(",", ".")) > 0 &&
    document.getElementById("input-netto-inhoudingen").value !== ""
  );
};

const periodiekeVakantietoeslag = () => {
  return document.getElementById("periodieke-vakantietoeslag").checked ? maandBedragBruto() * 0.08 : 0;
};

const periodiekeVakantietoeslagBerekenen = () => {
  return document.getElementById("periodieke-vakantietoeslag").checked;
};

const periodiekeEindejaarsuitkering = () => {
  return document.getElementById("periodieke-eindejaarsuitkering").checked ? maandBedragBruto() * 0.0833 : 0;
};

const periodiekeEindejaarsuitkeringBerekenen = () => {
  return document.getElementById("periodieke-eindejaarsuitkering").checked;
};

const telefoonVergoedingBerekenen = () => {
  return document.getElementById("telefoonvergoeding").checked;
};

const reisKostenVergoedingBerekenen = () => {
  return (
    document.getElementById("input-reiskosten-wwk").value &&
    parseFloat(document.getElementById("input-reiskosten-wwk").value.replace(",", ".")) > 0 &&
    document.getElementById("input-reiskosten-wwk").value !== ""
  );
};

const thuiswerkVergoedingBerekenen = () => {
  return (
    document.getElementById("input-thuiswerkvergoeding").value &&
    parseFloat(document.getElementById("input-thuiswerkvergoeding").value.replace(",", ".")) > 0 &&
    document.getElementById("input-thuiswerkvergoeding").value !== ""
  );
};

const aovBerekenen = () => {
  return document.getElementById("aov-select").selectedIndex !== 0;
};

const seniorenverlofBerekenen = () => {
  return document.querySelector("#select-seniorenverlof").selectedIndex !== 0;
};

const ouderverlofBerekenen = () => {
  return document.querySelector("#select-ouderverlof").selectedIndex !== 0;
};

const thuiswerkVergoeding = () => {
  return document.getElementById("input-thuiswerkvergoeding").value
    ? parseFloat(document.getElementById("input-thuiswerkvergoeding").value.replace(",", "."))
    : 0;
};

document.querySelectorAll(".thuiswerk-check").forEach((checkbox) => {
  const thuiswerkVergoedingEl = document.getElementById("input-thuiswerkvergoeding");

  checkbox.addEventListener("change", () => {
    let vergoeding = parseFloat(thuiswerkVergoedingEl.value.replace(",", ".")) || 0;
    if (checkbox.checked) {
      vergoeding += bedragen.thuiswerk;
      console.log(vergoeding);
    } else {
      vergoeding -= bedragen.thuiswerk;
      console.log(vergoeding);
    }
    thuiswerkVergoedingEl.value = vergoeding.toFixed(2).replace(".", ",");
    console.log("TEST");
    checkWwkEnThuiswerk();
  });
});

function checkWwkEnThuiswerk() {
  const wwkma = document.getElementById("wwk-ma");
  const wwkdi = document.getElementById("wwk-di");
  const wwkwo = document.getElementById("wwk-wo");
  const wwkdo = document.getElementById("wwk-do");
  const wwkvr = document.getElementById("wwk-vr");

  const maCheck = wwkma.value && parseFloat(wwkma.value.replace(",", ".")) > 0 && document.getElementById("thuiswerk-ma").checked;

  const diCheck = wwkdi.value && parseFloat(wwkdi.value.replace(",", ".")) > 0 && document.getElementById("thuiswerk-di").checked;

  const woCheck = wwkwo.value && parseFloat(wwkwo.value.replace(",", ".")) > 0 && document.getElementById("thuiswerk-wo").checked;
  const doCheck = wwkdo.value && parseFloat(wwkdo.value.replace(",", ".")) > 0 && document.getElementById("thuiswerk-do").checked;
  const vrCheck = wwkvr.value && parseFloat(wwkvr.value.replace(",", ".")) > 0 && document.getElementById("thuiswerk-vr").checked;

  if (maCheck || diCheck || woCheck || doCheck || vrCheck) {
    Toast.error(
      "Let op: Er zijn zowel reiskosten als thuiswerkvergoedingen ingevuld voor dezelfde dag(en). Controleer of dit klopt, want dit kan niet allebei tegelijk worden toegekend.",
    );
    specificeerWwkEl.classList.remove("verborgen");
  } else {
    specificeerWwkEl.classList.add("verborgen");
  }

  if (maCheck) {
    wwkma.classList.add("sus-input");
    wwkma.select();
  }
}

// console.log(periodiekeVakantietoeslag());

// NORMALE UREN PER MAAND BEREKENEN
function getWerkdagenInMaand(year, month) {
  // month is 0-based (0 = januari, 11 = december)
  let date = new Date(year, month, 1);
  let werkdagen = 0;

  while (date.getMonth() === month) {
    const dag = date.getDay(); // 0 = zondag, 6 = zaterdag

    if (dag !== 0 && dag !== 6) {
      werkdagen++;
    }

    date.setDate(date.getDate() + 1);
  }

  return werkdagen;
}

const normaleUrenPerMaand = () => {
  const vandaag = new Date();
  const maand = vandaag.getMonth(); // 0-based
  const jaar = vandaag.getFullYear();
  const peil = new Date(document.getElementById("peildatum").value);
  const peilMaand = peil.getMonth() + 1;
  const peilJaar = peil.getFullYear();
  // console.log(peilJaar, peilMaand);
  return (document.getElementById("peildatum") ? getWerkdagenInMaand(peilJaar, maand + 1) : getWerkdagenInMaand(jaar, maand + 1)) * 7.372; // 7.5 uur per werkdag
};

// console.log(normaleUrenPerMaand(), );

//#region SENIORENVERLOF

const soortEl = document.querySelector("#select-seniorenverlof");

const berekendeWtfSeniorenverlof = () => {
  const soort = soortEl ? soortEl.value : "Geen";
  switch (soort) {
    case "Geen":
      return 0.0;
    case "basis":
      return 0.10247 * wtf().toFixed(4);
    case "beide":
      return 0.2049 * wtf();
    case "62_plus":
      return (340 / 1659) * wtf();
    default:
      return 0;
  }
};

const standaardWtfSeniorenverlof = () => {
  const soort = soortEl ? soortEl.value : "Geen";
  switch (soort) {
    case "Geen":
      return 0.0;
    case "basis":
      return 0.10247;
    case "beide":
      return 0.2049;
    case "62_plus":
      return 0.2049;
    default:
      return 0;
  }
};

const berekendeWtfSeniorenverlofBerekenening = () => {
  const wtfWaarde = standaardWtfSeniorenverlof();
  // console.log(wtfWaarde);
  return `(${wtfWaarde.toFixed(5).replace(".", ",")} * ${wtf().toFixed(5).replace(".", ",")} = ${(wtfWaarde * wtf()).toFixed(5).replace(".", ",")})`;
};

const seniorenverlofKortingsPercentage = () => {
  const percentage = schaalDropdown.selectedIndex < 86 ? 0.3 : 0.45;
  return percentage;
};

function updateSeniorenverlofElementen() {
  if (document.getElementById("select-seniorenverlof").value !== "Geen") {
    document.getElementById("seniorenverlof-berekende-wtf").textContent = berekendeWtfSeniorenverlof().toFixed(5).replace(".", ",");
    document.getElementById("standaard-wtf-seniorenverlof").textContent = `(${berekendeWtfSeniorenverlof().toFixed(5).replace(".", ",")})`;
    soortEl.value !== "Geen" && (document.getElementById("senVerlofBerekening").textContent = berekendeWtfSeniorenverlofBerekenening());
  }
}

updateSeniorenverlofElementen();

const wtfSeniorenverlof = () => {
  if (document.getElementById("input-aangepaste-wtf").value && document.getElementById("input-aangepaste-wtf").value != 0) {
    return parseFloat(document.getElementById("input-aangepaste-wtf").value.replace(",", "."));
  } else {
    return standaardWtfSeniorenverlof() * wtf();
  }
};

const kortingSeniorenverlofBasis = () => {
  if (!document.getElementById("seniorenverlof-actief").checked) {
    return 0;
  }
  const soort = soortEl ? soortEl.value : "Geen";

  if (soort === "Geen") return 0;
  if (soort === "basis" || soort === "62_plus") return wtfSeniorenverlof() * normBedrag() * seniorenverlofKortingsPercentage();
  if (soort === "beide") return 0.10247 * wtf() * normBedrag() * seniorenverlofKortingsPercentage();
};

const kortingSeniorenverlofExtra = () => {
  const soort = soortEl ? soortEl.value : "Geen";
  if (soort === "Geen" || soort === "basis" || soort === "62_plus") return 0;
  let wtfSen;
  let wtfSenXtra;
  if (document.getElementById("input-aangepaste-wtf").value && document.getElementById("input-aangepaste-wtf").value != 0) {
    wtfSen = parseFloat(document.getElementById("input-aangepaste-wtf").value.replace(",", "."));
  } else {
    wtfSen = standaardWtfSeniorenverlof() * wtf();
  }
  wtfSenXtra = wtfSeniorenverlof() - 0.10247 * wtf();
  return wtfSenXtra * normBedrag();
};

//#endregion SENIORENVERLOF

//#region OUDERVERLOF

const methode_wtf_ouderverlof = "methode1";
// methode1 = wtf verlof
// methode2 = uren_wtf_verlof * normuren_maand * normurenmaand_afgerond

const wtfOuderverlof = () => {
  const wtfVerlof = document.getElementById("input-wtf-ouderverlof").value
    ? parseFloat(document.getElementById("input-wtf-ouderverlof").value.replace(",", "."))
    : 0;
  const urenMaand = normaleUrenPerMaand();
  const urenMaandAfgerond = Math.round(normaleUrenPerMaand() * 10) / 10;
  // console.log(wtfVerlof * urenMaand / urenMaandAfgerond)
  if (methode_wtf_ouderverlof === "") {
    return wtfVerlof;
  } else if (methode_wtf_ouderverlof === "methode2") {
    return (wtfVerlof * urenMaand) / urenMaandAfgerond;
  } else {
    return wtfVerlof;
  }
};

const kortingsPercentageOuderverlofStandaard = () => {
  const soort = document.querySelector("#select-ouderverlof").value;
  if (soort === "Geen") return 0;
  if (soort === "geboorteverlof" || soort === "osvw") return 0.3;
  if (soort === "osvb") return 0.45;
  if (soort === "osvo") return 1;
};

function updateKortingspercentageOuderverlof() {
  const percentage = kortingsPercentageOuderverlofStandaard();
  document.getElementById("ouderverlof-kortingspercentage").textContent = `${(percentage * 100).toFixed(0)}% `;
}

const kortingsPercentageOuderverlof = () => {
  const soort = document.querySelector("#select-ouderverlof").value;

  if (
    soort === "osvb" &&
    document.getElementById("ouderverlof-aangepast-kortingspercentage").value &&
    document.getElementById("ouderverlof-aangepast-kortingspercentage").value != 0
  ) {
    return parseFloat(document.getElementById("ouderverlof-aangepast-kortingspercentage").value.replace(",", ".")) / 100;
  } else if (soort === "osvb") {
    return 0.45;
  } else {
    return kortingsPercentageOuderverlofStandaard();
  }
};

$("#ouderverlof-aangepast-kortingspercentage").on("change", function () {
  const aangepastEl = document.getElementById("ouderverlof-aangepast-kortingspercentage");
  if (aangepastEl.value > 100) {
    Toast.warning(`Een kortingspercentage van meer dan 100%? Dat klopt waarschijnlijk niet!`);
    aangepastEl.value = 100;
    aangepastEl.select();
    aangepastEl.classList.add("sus-input");
  } else if (aangepastEl.value < 1 && aangepastEl.value != 0 && aangepastEl.value != "") {
    Toast.warning(`Vul een geheel getal in bij het kortingspercentage, bijvoorbeeld 30 voor 30%.`);
  } else {
    aangepastEl.classList.remove("sus-input");
  }
  updateBerekeningen();
});

function soortOuderverlof() {
  const soort = document.querySelector("#select-ouderverlof").value;
  if (soort === "osvb") {
    document.getElementById("ouderverlof-aangepast-kortingspercentage").disabled = false;
    document.getElementById("ouder-info-aangepast").textContent = "%";
  } else {
    document.getElementById("ouderverlof-aangepast-kortingspercentage").disabled = true;
    document.getElementById("ouder-info-aangepast").textContent = "Alleen bij betaald ouderschapsverlof vanuit de CAO MBO";
  }
}

$("#select-ouderverlof").on("change", function () {
  soortOuderverlof();
});

updateKortingspercentageOuderverlof();
soortOuderverlof();
// console.log(normaleUrenPerMaand());

const kortingOuderverlof = () => {
  const soort = document.querySelector("#select-ouderverlof").value;
  const factorVerlof = wtfOuderverlof();
  // console.log(factorVerlof, factorVerlof * 5495.0 * 0.45);
  if (soort === "Geen") return 0;
  if (soort === "geboorteverlof" || soort === "osvw") return Math.floor(wtfOuderverlof() * normBedrag() * 0.3 * 100) / 100;
  if (soort === "osvb") return Math.floor(factorVerlof * normBedrag() * kortingsPercentageOuderverlof() * 1000) / 1000;
  if (soort === "osvo") return Math.floor(wtfOuderverlof() * normBedrag() * 100) / 100;
};

const kortingZiektekostenOuderverlof = () => {
  const ziektekosten = bedragen.ziektekosten;
  const aanv_ziektekosten = bedragen.aanvullende_ziektekosten;
  const soort = document.querySelector("#select-ouderverlof").value;
  const wtf = document.getElementById("input-wtf-ouderverlof").value
    ? parseFloat(document.getElementById("input-wtf-ouderverlof").value.replace(",", "."))
    : 0;

  if (soort === "Geen" || soort === "osvw") return { standaard: 0, aanvullend: 0 };
  if (soort === "osvb" || soort === "osvo") return { standaard: wtf * ziektekosten, aanvullend: wtf * aanv_ziektekosten };
  if (soort === "geboorteverlof") return { standaard: wtf * ziektekosten * 0.3, aanvullend: wtf * aanv_ziektekosten * 0.3 };
};

const kortingEhboBhvOuderverlof = () => {
  const ehbo = bedragen.EHBO;
  const bhv = bedragen.BHV;
  const soort = document.querySelector("#select-ouderverlof").value;
  const wtfVerlof = wtfOuderverlof();

  if (soort === "Geen" || soort === "osvw") return { ehbo_korting: 0, bhv_korting: 0 };
  if (soort === "osvb" || soort === "osvo")
    return {
      ehbo_korting: ehboBerekenen() ? Math.round((wtfVerlof / wtf()) * ehbo * 100) / 100 : 0,
      bhv_korting: bhvBerekenen() ? Math.round(wtfVerlof * bhv * 100) / 100 : 0,
    };
  if (soort === "geboorteverlof")
    return {
      ehbo_korting: ehboBerekenen() ? Math.round(wtfVerlof * ehbo * 0.3 * 100) / 100 : 0,
      bhv_korting: bhvBerekenen() ? Math.round(wtfVerlof * bhv * 0.3 * 100) / 100 : 0,
    };
};

// console.log(wtfOuderverlof());

//#endregion OUDERVERLOF

document.querySelectorAll(".updater").forEach((el) => {
  el.addEventListener("change", () => {
    updateBerekeningen();
  });
});

export function updateBerekeningen() {
  updateSeniorenverlofElementen();
  document.getElementById("senVerlofBerekening").textContent = berekendeWtfSeniorenverlofBerekenening();
  bedragenInConsole();
  saveToLocalStorage();
  kortingSeniorenverlofBasis();
  kortingSeniorenverlofExtra();
  updateKortingspercentageOuderverlof();
  console.log("Laatste update:", new Date().toLocaleTimeString());
}

soortEl.addEventListener("change", () => {
  updateBerekeningen();
});

const belastbaarInkomen = () => {
  const optellen =
    maandBedragBruto() + ziektekostenBedrag() + aanvullendeZiektekostenBedrag() + ehboVergoeding() + bhvVergoeding() + brutoVergoeding();

  const aftrekken =
    kortingSeniorenverlofBasis() +
    kortingSeniorenverlofExtra() +
    aopBedrag() +
    pensioenBedrag() +
    aovBedrag() +
    brutoInhouding() +
    kortingOuderverlof() +
    kortingEhboBhvOuderverlof().ehbo_korting +
    kortingEhboBhvOuderverlof().bhv_korting;

  // console.log(
  //   "optellen:",
  //   maandBedragBruto(),
  //   ziektekostenBedrag(),
  //   aanvullendeZiektekostenBedrag(),
  //   ehboVergoeding(),
  //   bhvVergoeding(),
  //   brutoVergoeding(),
  // );
  // console.log(
  //   "aftrekken:",
  //   kortingSeniorenverlofBasis(),
  //   kortingSeniorenverlofExtra(),
  //   aopBedrag(),
  //   pensioenBedrag(),
  //   aovBedrag(),
  //   brutoInhouding(),
  //   kortingOuderverlof(),
  //   kortingEhboBhvOuderverlof().ehbo_korting,
  //   kortingEhboBhvOuderverlof().bhv_korting,
  // );

  return parseFloat(optellen - aftrekken);
};

const belastbaarInkomenZonderVerlof = () => {
  const optellen =
    maandBedragBruto() + ziektekostenBedrag() + aanvullendeZiektekostenBedrag() + ehboVergoeding() + bhvVergoeding() + brutoVergoeding();

  const aftrekken = aopBedrag() + pensioenBedrag() + aovBedrag() + brutoInhouding();

  return parseFloat(optellen - aftrekken);
};

const loonheffing = () => {
  let bel_inkomen = belastbaarInkomen();
  if (isNaN(bel_inkomen)) bel_inkomen = 0;
  const gesorteerd = Array.isArray(witte_tabel_2026) ? [...witte_tabel_2026].sort((a, b) => a.tabelloon - b.tabelloon) : [];
  const met_korting = (document.getElementById("loonheffingskorting") || {}).checked;
  let resultaat = null;

  for (let i = 0; i < gesorteerd.length; i++) {
    if (gesorteerd[i].tabelloon <= bel_inkomen) {
      resultaat = gesorteerd[i];
    } else {
      break;
    }
  }

  if (!resultaat) {
    resultaat = gesorteerd.length > 0 ? gesorteerd[0] : { met_lhk: 0, zonder_lhk: 0 };
  }

  return met_korting ? resultaat.met_lhk : resultaat.zonder_lhk;
};

const loonheffingZonderVerlof = () => {
  let bel_inkomen = belastbaarInkomenZonderVerlof();
  if (isNaN(bel_inkomen)) bel_inkomen = 0;
  const gesorteerd = Array.isArray(witte_tabel_2026) ? [...witte_tabel_2026].sort((a, b) => a.tabelloon - b.tabelloon) : [];
  const met_korting = (document.getElementById("loonheffingskorting") || {}).checked;
  let resultaat = null;

  for (let i = 0; i < gesorteerd.length; i++) {
    if (gesorteerd[i].tabelloon <= bel_inkomen) {
      resultaat = gesorteerd[i];
    } else {
      break;
    }
  }

  if (!resultaat) {
    resultaat = gesorteerd.length > 0 ? gesorteerd[0] : { met_lhk: 0, zonder_lhk: 0 };
  }

  return met_korting ? resultaat.met_lhk : resultaat.zonder_lhk;
};

const brutoSalaris = () => {
  const optellen =
    maandBedragBruto() + ziektekostenBedrag() + aanvullendeZiektekostenBedrag() + ehboVergoeding() + bhvVergoeding() + brutoVergoeding();

  const aftrekken =
    kortingSeniorenverlofBasis() +
    kortingSeniorenverlofExtra() +
    brutoInhouding() +
    kortingOuderverlof() +
    kortingEhboBhvOuderverlof().ehbo_korting +
    kortingEhboBhvOuderverlof().bhv_korting;

  return parseFloat(optellen - aftrekken);
};

const brutoSalarisZonderVerlof = () => {
  const optellen =
    maandBedragBruto() + ziektekostenBedrag() + aanvullendeZiektekostenBedrag() + ehboVergoeding() + bhvVergoeding() + brutoVergoeding();

  const aftrekken = brutoInhouding();

  return parseFloat(optellen - aftrekken);
};

const nettoSalaris = () => {
  const optellen = brutoSalaris();
  const aftrekken = loonheffing() + aopBedrag() + pensioenBedrag() + aovBedrag();

  return parseFloat(optellen - aftrekken);
};

const nettoSalarisZonderVerlof = () => {
  const optellen = brutoSalarisZonderVerlof();
  const aftrekken = loonheffingZonderVerlof() + aopBedrag() + pensioenBedrag() + aovBedrag();

  return parseFloat(optellen - aftrekken);
};

const teBetalenSalaris = () => {
  return nettoSalaris() + vergoedingWwk() + thuiswerkVergoeding() + telefoonvergoeding() + nettoVergoeding() - nettoInhoudingen();
};

const teBetalenSalarisZonderVerlof = () => {
  return nettoSalarisZonderVerlof() + vergoedingWwk() + thuiswerkVergoeding() + telefoonvergoeding() + nettoVergoeding() - nettoInhoudingen();
};

// console.log(brutoSalaris());

document.querySelectorAll(".form-control").forEach((input) => {
  input.addEventListener("change", () => {
    if (!checkInputLeegMag(input.value.replace(",", ".")) && !input.classList.contains("no-check")) {
      Toast.error(`Ongeldige invoer bij ${input.name}, vul een getal in.`);
      input.classList.add("foute-input");
      console.log(input.name);
      input.select();
    } else {
      input.classList.remove("foute-input");
      bedragenInConsole();
    }
  });
});

document.querySelectorAll(" .form-select").forEach((select) => {
  select.addEventListener("change", () => {
    bedragenInConsole();
  });
});

// $('#schaal-keuze').on('change', function () {
//     bedragenInConsole();
// });

// #region NETTO VERGOEDINGEN

//#region REISKOSTENVERGOEDING
const reiskostenWwk = () => {
  const wwkMa = checkInput(document.getElementById("wwk-ma").value) ? parseFloat(document.getElementById("wwk-ma").value.replace(",", ".")) : 0;
  const wwkDi = checkInput(document.getElementById("wwk-di").value) ? parseFloat(document.getElementById("wwk-di").value.replace(",", ".")) : 0;
  const wwkWo = checkInput(document.getElementById("wwk-wo").value) ? parseFloat(document.getElementById("wwk-wo").value.replace(",", ".")) : 0;
  const wwkDo = checkInput(document.getElementById("wwk-do").value) ? parseFloat(document.getElementById("wwk-do").value.replace(",", ".")) : 0;
  const wwkVr = checkInput(document.getElementById("wwk-vr").value) ? parseFloat(document.getElementById("wwk-vr").value.replace(",", ".")) : 0;

  return wwkMa + wwkDi + wwkWo + wwkDo + wwkVr;
};

const reiskostenWwkInputEl = document.getElementById("input-reiskosten-wwk");

reiskostenWwkInputEl.addEventListener("change", () => {
  bedragenInConsole();
});

const inputsWwkSpecificatie = document.querySelectorAll(".wwk-spec");

inputsWwkSpecificatie.forEach((el) => {
  el.addEventListener("change", () => {
    if (!checkInputLeegMag(el.value)) {
      el.classList.add("foute-input");
      Toast.error("Ongeldige invoer bij " + el.id + ", vul een getal in.");
    } else if (checkInputLeegMag(el.value)) {
      el.classList.remove("foute-input");
    }
    reiskostenWwkInputEl.value = FormateerGetallen.decimalen2(reiskostenWwk());
    bedragenInConsole();
  });
});

//@ FUNCTIE OM DE INHOUD VAN EEN WOON-WERK INPUT TE KOPIEREN NAAR EEN ANDERE WOON-WERK INPUT BIJ HET KLIKKEN OP EEN LABEL, EN OM DE INHOUD TE VERWIJDEREN ALS ER AL EEN WAARDE IN STAAT
const labels = document.querySelectorAll(".specificatie-dag");
const inputs = document.querySelectorAll(".wwk-spec");

let laatsteInput = null;

let inputHistory = [];

// Houd bij welke inputs gevuld worden
inputs.forEach((input) => {
  input.addEventListener("input", function () {
    const value = input.value.trim();

    if (value !== "") {
      // Verwijder als hij al in de history zit
      inputHistory = inputHistory.filter((i) => i !== input);
      // Voeg toe als nieuwste
      inputHistory.push(input);
    } else {
      // Als leeg → verwijder uit history
      inputHistory = inputHistory.filter((i) => i !== input);
    }
  });
});

labels.forEach((label) => {
  label.addEventListener("click", function () {
    const dag = label.textContent.toLowerCase();
    const doelInput = document.getElementById("wwk-" + dag);
    if (!doelInput) return;

    // 🔁 Als doelInput al gevuld is → leegmaken
    if (doelInput.value.trim() !== "") {
      doelInput.value = "";
      doelInput.dispatchEvent(new Event("input", { bubbles: true }));
      doelInput.dispatchEvent(new Event("change", { bubbles: true }));
      bedragenInConsole();
      return;
    }

    // 📋 Pak laatste gevulde input uit history
    const laatsteInput = inputHistory[inputHistory.length - 1];
    if (!laatsteInput) return;

    doelInput.value = laatsteInput.value;
    doelInput.dispatchEvent(new Event("input", { bubbles: true }));
    doelInput.dispatchEvent(new Event("change", { bubbles: true }));
    bedragenInConsole();
  });
});

const labelsThuis = document.querySelectorAll(".specificatie-dag-thuis");
const inputsThuis = document.querySelectorAll(".thuis-spec");
let laatsteInputThuis = null;
let inputHistoryThuis = [];

// Houd bij welke inputs gevuld worden
inputsThuis.forEach((input) => {
  input.addEventListener("input", function () {
    const value = input.value.trim();

    if (value !== "") {
      // Verwijder als hij al in de history zit
      inputHistoryThuis = inputHistoryThuis.filter((i) => i !== input);
      // Voeg toe als nieuwste
      inputHistoryThuis.push(input);
    } else {
      // Als leeg → verwijder uit history
      inputHistoryThuis = inputHistoryThuis.filter((i) => i !== input);
    }
  });
});

labelsThuis.forEach((label) => {
  label.addEventListener("click", function () {
    const dag = label.textContent.toLowerCase();
    const doelInput = document.getElementById("thuiswerk-" + dag);
    if (!doelInput) return;

    // 🔁 Als doelInput al gevuld is → leegmaken
    if (doelInput.value.trim() !== "") {
      doelInput.value = "";
      doelInput.dispatchEvent(new Event("input", { bubbles: true }));
      doelInput.dispatchEvent(new Event("change", { bubbles: true }));
      bedragenInConsole();
      return;
    }

    // 📋 Pak laatste gevulde input uit history
    const laatsteInputThuis = inputHistoryThuis[inputHistoryThuis.length - 1];
    if (!laatsteInputThuis) return;

    doelInput.value = laatsteInputThuis.value;
    doelInput.dispatchEvent(new Event("input", { bubbles: true }));
    doelInput.dispatchEvent(new Event("change", { bubbles: true }));
    bedragenInConsole();
  });
});

function clearInvoerWwk() {
  inputs.forEach((invoer) => {
    invoer.value = "";
    invoer.classList.remove("foute-input");
  });
}

function clearInvoerThuiswerk() {
  inputsThuis.forEach((invoer) => {
    invoer.value = "";
    invoer.classList.remove("foute-input");
  });
}

const thuisWerkVergoeding = () => {
  const thuisMa = checkInput(document.getElementById("thuiswerk-ma").value)
    ? parseFloat(document.getElementById("thuiswerk-ma").value.replace(",", "."))
    : 0;
  const thuisDi = checkInput(document.getElementById("thuiswerk-di").value)
    ? parseFloat(document.getElementById("thuiswerk-di").value.replace(",", "."))
    : 0;
  const thuisWo = checkInput(document.getElementById("thuiswerk-wo").value)
    ? parseFloat(document.getElementById("thuiswerk-wo").value.replace(",", "."))
    : 0;
  const thuisDo = checkInput(document.getElementById("thuiswerk-do").value)
    ? parseFloat(document.getElementById("thuiswerk-do").value.replace(",", "."))
    : 0;
  const thuisVr = checkInput(document.getElementById("thuiswerk-vr").value)
    ? parseFloat(document.getElementById("thuiswerk-vr").value.replace(",", "."))
    : 0;

  return thuisMa + thuisDi + thuisWo + thuisDo + thuisVr;
};

const btnLeegmaken = document.getElementById("specificatie-leegmaken");
const btnLeegmakenThuis = document.getElementById("specificatie-thuiswerk-leegmaken");
btnLeegmaken.addEventListener("click", clearInvoerWwk);
btnLeegmakenThuis.addEventListener("click", clearInvoerThuiswerk);

const vergoedingWwk = () => {
  if (reiskostenWwk() != 0) {
    return reiskostenWwk();
  } else {
    if (reiskostenWwkInputEl.value === "") {
      return 0;
    } else {
      if (checkInput(reiskostenWwkInputEl.value)) {
        return parseFloat(reiskostenWwkInputEl.value.replace(",", "."));
      }
    }
  }
};

const specificeerWwkBtn = document.getElementById("specificeer-wwk");
const specificeerWwkEl = document.getElementById("reiskosten-specificatie");

specificeerWwkBtn.addEventListener("click", () => {
  const isVerborgen = specificeerWwkEl.classList.toggle("verborgen");

  if (isVerborgen) {
    specificeerWwkBtn.textContent = "Specificeer";
  } else {
    specificeerWwkBtn.textContent = "Verbergen";
  }
});

const thuiswerkInputEl = document.getElementById("input-thuiswerkvergoeding");
thuiswerkInputEl.addEventListener("change", () => {
  bedragenInConsole();
});

const thuiswerkSpec = document.querySelectorAll(".thuis-spec");
thuiswerkSpec.forEach((el) => {
  el.addEventListener("change", () => {
    if (!checkInputLeegMag(el.value)) {
      el.classList.add("foute-input");
      Toast.error("Ongeldige invoer bij " + el.name + ", vul een getal in.");
    } else if (checkInputLeegMag(el.value)) {
      el.classList.remove("foute-input");
    }
    thuiswerkInputEl.value = FormateerGetallen.decimalen2(thuisWerkVergoeding());
    bedragenInConsole();
  });
});

const specificeerTuiswerkBtn = document.getElementById("specificeer-thuiswerkvergoeding");
const specificeerThuiswerkEl = document.getElementById("thuiswerkvergoeding-specificatie");

specificeerTuiswerkBtn.addEventListener("click", () => {
  const isVerborgen = specificeerThuiswerkEl.classList.toggle("verborgen");

  if (isVerborgen) {
    specificeerTuiswerkBtn.textContent = "Specificeer";
  } else {
    specificeerTuiswerkBtn.textContent = "Verbergen";
  }
});

//#endregion REISKOSTENVERGOEDING

const telefoonvergoeding = () => {
  return document.getElementById("telefoonvergoeding").checked ? bedragen.telefoonvergoeding : 0;
};

// #endregion NETTOVERGOEDINGEN

//& #region ONBETAALD VERLOF

//& #endregion ONBETAALD VERLOF

// #region LOCAL STORAGE OPSLAG
const saveDataEl = document.getElementById("save-data");
const saveData = () => {
  return saveDataEl.checked;
};

const alleCheckboxen = document.querySelectorAll('input[type="checkbox"]');
alleCheckboxen.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    if (saveData()) {
      saveToLocalStorage();
    }
    bedragenInConsole();
  });
});

document.querySelectorAll(".opslag").forEach((opslagEl) => {
  opslagEl.addEventListener("click", () => {
    const sectie = opslagEl.closest("section");

    if (opslagEl.classList.contains("actief")) {
      opslagEl.classList.remove("actief");
      opslagEl.classList.add("inactief");
    } else {
      opslagEl.classList.remove("inactief");
      opslagEl.classList.add("actief");
    }

    switch (sectie.id) {
      case "basis-gegevens":
        basisGegevensOpslaan = !basisGegevensOpslaan;
        break;
      case "aanvullende-gegevens":
        aanvullendeGegevensOpslaan = !aanvullendeGegevensOpslaan;
        break;
      case "bruto-elementen":
        brutoElementenOpslaan = !brutoElementenOpslaan;
        break;
      case "netto-elementen":
        nettoElementenOpslaan = !nettoElementenOpslaan;
        break;
      case "senioren-verlof":
        seniorenverlofOpslaan = !seniorenverlofOpslaan;
        break;
      case "ouder-verlof":
        ouderVerlofOpslaan = !ouderVerlofOpslaan;
        break;
      case "onbetaald-verlof":
        onbetaaldVerlofOpslaan = !onbetaaldVerlofOpslaan;
        break;
    }

    const tekstVoorConsole = `${sectie.id} opslaan staat ${opslagEl.classList.contains("actief") ? "aan" : "uit"}`;
    console.log(
      tekstVoorConsole,
      basisGegevensOpslaan,
      aanvullendeGegevensOpslaan,
      brutoElementenOpslaan,
      seniorenverlofOpslaan,
      ouderVerlofOpslaan,
      onbetaaldVerlofOpslaan,
    );
  });
});

function dubbelCheckVerlof() {
  const dubbelCheckEl = document.querySelectorAll(".dubbel-check-span");
  if (document.getElementById("select-seniorenverlof").selectedIndex > 0 && document.querySelector("#select-ouderverlof").selectedIndex > 0) {
    dubbelCheckEl.forEach((span) => {
      let s = document.querySelector("#select-ouderverlof").options[document.querySelector("#select-ouderverlof").selectedIndex].text.toUpperCase();
      let index = s.lastIndexOf("(");
      let result = index !== -1 ? s.substring(0, index).trim() : s;
      span.textContent = `Weet je zeker dat je zowel SENIORENVERLOF als ${result} wilt opnemen?`;
    });
  } else {
    dubbelCheckEl.forEach((span) => {
      span.textContent = "";
    });
  }
}

const keuzeOuderverlofEl = document.querySelector("#select-ouderverlof");
keuzeOuderverlofEl.addEventListener("change", () => {
  disableOnnodigeElementen();
});

function disableOnnodigeElementen() {
  const elWtf = document.getElementById("input-wtf-ouderverlof");
  const elKortingAangepast = document.getElementById("ouderverlof-aangepast-kortingspercentage");
  const elKorting = document.getElementById("ouderverlof-kortingspercentage");

  if (keuzeOuderverlofEl.selectedIndex > 0) {
    elWtf.disabled = false;
    elKortingAangepast.disabled = false;
    elKorting.classList.remove("opacity-0");
    elWtf.style.color = "black";
  } else {
    elWtf.disabled = true;
    elKortingAangepast.disabled = true;
    elKorting.classList.add("opacity-0");
    elWtf.style.color = "transparent";
  }
}

dubbelCheckVerlof();

document.querySelectorAll(".dubbel-check").forEach((el) => {
  el.addEventListener("change", () => {
    dubbelCheckVerlof();
  });
});

$("#keuze-eerst-analyse").on("change", function () {
  saveToLocalStorage();
});

function saveToLocalStorage() {
  const dataOpslag = {
    invoerOpslaan: document.getElementById("save-data").checked,

    // Opslaan voor iconen
    invoerBasisgegevens: basisGegevensOpslaan,
    invoerAanvullendeGegevens: aanvullendeGegevensOpslaan,
    invoerBrutoElementen: brutoElementenOpslaan,
    invoerSeniorenverlof: seniorenverlofOpslaan,
    invoerOuderVerlof: ouderVerlofOpslaan,
    invoerOnbetaaldVerlof: onbetaaldVerlofOpslaan,

    // OPSLAAN BASISGEGEVENS
    schaal: schaalDropdown.selectedIndex,
    wtf: wtfEl.value,
    peildatum: document.getElementById("peildatum").value,
    basis_salaris: parseFloat(document.getElementById("inputBasisSalaris").value) || 0,

    // OPSLAAN AANVULLENDE GEGEVENS
    abpJaarinkomen: abpJaarinkomenEl.value,
    loonheffingskorting: document.getElementById("loonheffingskorting").checked,
    aov: document.getElementById("aov-select").selectedIndex,

    // OPSLAAN BRUTO ELEMENTEN
    aanvullendeZiektekosten: document.getElementById("aanvullende-ziektekosten").checked,
    ehboVergoeding: document.getElementById("ehbo-vergoeding").checked,
    bhvVergoeding: document.getElementById("bhv-vergoeding").checked,
    periodieke_vakantietoeslag: document.getElementById("periodieke-vakantietoeslag").checked,
    periodieke_eindejaarsuitkering: document.getElementById("periodieke-eindejaarsuitkering").checked,
    brutoVergoeding: document.getElementById("input-bruto-vergoeding").value,
    brutoInhouding: document.getElementById("input-bruto-inhouding").value,

    // OPSLAAN NETTO ELEMENTEN
    reiskostenWwk: reiskostenWwkInputEl.value,
    reiskostenWwkMaandag: document.getElementById("wwk-ma").value,
    reiskostenWwkDinsdag: document.getElementById("wwk-di").value,
    reiskostenWwkWoensdag: document.getElementById("wwk-wo").value,
    reiskostenWwkDonderdag: document.getElementById("wwk-do").value,
    reiskostenWwkVrijdag: document.getElementById("wwk-vr").value,
    thuiswerkVergoeding: document.getElementById("input-thuiswerkvergoeding").value,
    thuiswerkVergoedingMaandag: document.getElementById("thuiswerk-ma").value,
    thuiswerkVergoedingDinsdag: document.getElementById("thuiswerk-di").value,
    thuiswerkVergoedingWoensdag: document.getElementById("thuiswerk-wo").value,
    thuiswerkVergoedingDonderdag: document.getElementById("thuiswerk-do").value,
    thuiswerkVergoedingVrijdag: document.getElementById("thuiswerk-vr").value,
    telefoonvergoeding: document.getElementById("telefoonvergoeding").checked,
    nettoInhoudingen: document.getElementById("input-netto-inhoudingen").value,

    // OPSLAAN VERLOF
    soortSeniorenverlof: document.querySelector("#select-seniorenverlof").selectedIndex,
    wtfSeniorenverlof: document.getElementById("input-aangepaste-wtf").value,

    soortOuderverlof: document.querySelector("#select-ouderverlof").selectedIndex,
    wtfOuderverlof: document.getElementById("input-wtf-ouderverlof").value,
    ouderverlofAangepastKortingspercentage: document.getElementById("ouderverlof-aangepast-kortingspercentage").value,

    keuzeAnalyse: document.getElementById("keuze-eerst-analyse").checked,
  };

  localStorage.setItem("dataOpslag", JSON.stringify(dataOpslag));
  const nu = new Date();
  console.log("data opgeslagen", nu.toLocaleDateString(), nu.toLocaleTimeString());
}

// #endregion LOCAL STORAGE OPSLAG

function bedragenInConsole() {
  // console.clear();

  const table = new Table();
  const tableGrondslagen = new Table();

  tableGrondslagen.addRow({ Grondslag: "ABP Jaarinkomen", Bedrag: abpJaarloon() }, { separator: true });
  tableGrondslagen.addRow(
    { Grondslag: "Belastbaar inkomen", Bedrag: Math.round(belastbaarInkomen() * 100) / 100 },
    { separator: true, color: "red" },
  );
  tableGrondslagen.addRow(
    { Grondslag: "Kortingspercentage sen.verlof", Bedrag: seniorenverlofKortingsPercentage() * 100 + "%" },
    { separator: true },
  );

  // table.addRows({ soort: "AOP", waarde: Math.round(aopBedrag() * 100) / 100 }, { seperator: true });

  table.addRow({ Unit: "Normbedrag", Bedrag: Math.round(normBedrag() * 100) / 100 }, { separator: true });
  table.addRow({ Unit: "Maandbedrag bruto", Bedrag: Math.round(maandBedragBruto() * 100) / 100 }, { separator: true });
  // table.addRow(
  //   { Unit: "Korting i.v.m. basis seniorenverlof", Bedrag: (Math.round(kortingSeniorenverlofBasis() * 100) / 100) * -1 },
  //   { separator: true },
  // );
  // table.addRow(
  //   { Unit: "Korting i.v.m. extra seniorenverlof", Bedrag: (Math.round(kortingSeniorenverlofExtra() * 100) / 100) * -1 },
  //   { separator: true },
  // );
  table.addRow({ Unit: "AOP", Bedrag: (Math.round(aopBedrag() * 100) / 100) * -1 }, { separator: true });
  table.addRow({ Unit: "Pensioen", Bedrag: (Math.round(pensioenBedrag() * 100) / 100) * -1 }, { separator: true });
  if (aovBerekenen()) table.addRow({ Unit: "AOV", Bedrag: (Math.round(aovBedrag() * 100) / 100) * -1 }, { separator: true });
  table.addRow({ Unit: "Ziektekosten", Bedrag: Math.round(ziektekostenBedrag() * 100) / 100 }, { separator: true });
  if (aanvullendeZiektekostenBerekenen())
    table.addRow({ Unit: "Aanvullende ziektekosten", Bedrag: Math.round(aanvullendeZiektekostenBedrag() * 100) / 100 }, { separator: true });
  if (ehboBerekenen()) table.addRow({ Unit: "EHBO", Bedrag: Math.round(ehboVergoeding() * 100) / 100 }, { separator: true });
  if (bhvBerekenen()) table.addRow({ Unit: "BHV", Bedrag: Math.round(bhvVergoeding() * 100) / 100 }, { separator: true });
  if (brutoVergoedingBerekenen()) table.addRow({ Unit: "Bruto Vergoeding", Bedrag: Math.round(brutoVergoeding() * 100) / 100 }, { separator: true });
  if (brutoInhoudingBerekenen())
    table.addRow({ Unit: "Bruto Inhouding", Bedrag: (Math.round(brutoInhouding() * 100) / 100) * -1 }, { separator: true });
  table.addRow({ Unit: "Loonheffing", Bedrag: (Math.round(loonheffing() * 100) / 100) * -1 }, { separator: true });

  if (reisKostenVergoedingBerekenen())
    table.addRow({ Unit: "Reiskostenvergoeding", Bedrag: Math.round(vergoedingWwk() * 100) / 100 }, { separator: true });
  table.addRow({ Unit: "Telefoonvergoeding", Bedrag: Math.round(telefoonvergoeding() * 100) / 100 }, { separator: true });
  if (thuiswerkVergoedingBerekenen())
    table.addRow({ Unit: "Thuiswerkvergoeding", Bedrag: Math.round(thuisWerkVergoeding() * 100) / 100 }, { separator: true });

  const tableVerlof = new Table();
  if (seniorenverlofBerekenen())
    tableVerlof.addRow(
      { Soort: "Seniorenverlof", Korting: Math.round(kortingSeniorenverlofBasis() * 100) / 100, "WTF: ": wtfSeniorenverlof() },
      { separator: true },
    );
  if (seniorenverlofBerekenen())
    tableVerlof.addRow(
      { Soort: "Extra Seniorenverlof", Korting: (Math.round(kortingSeniorenverlofExtra() * 100) / 100).toFixed(2), "WTF: ": wtfSeniorenverlof() },
      { separator: true },
    );
  tableVerlof.addRow(
    { Soort: "Ouderverlof", Korting: (Math.round(kortingOuderverlof() * 100) / 100).toFixed(2), "WTF: ": wtfOuderverlof() },
    { separator: true },
  );
  if (ehboBerekenen())
    tableVerlof.addRow(
      {
        Soort: "Korting EHBO onbetaald verlof",
        Korting: document.getElementById("ehbo-vergoeding").checked
          ? (Math.round(kortingEhboBhvOuderverlof().ehbo_korting * 100) / 100).toFixed(2)
          : 0,
        "WTF: ": 0,
      },
      { separator: true },
    );
  if (bhvBerekenen())
    tableVerlof.addRow(
      {
        Soort: "Korting BHV onbetaald verlof",
        Korting: document.getElementById("bhv-vergoeding").checked ? (Math.round(kortingEhboBhvOuderverlof().bhv_korting * 100) / 100).toFixed(2) : 0,
        "WTF: ": 0,
      },
      { separator: true },
    );

  const tableBrutoNetto = new Table();
  tableBrutoNetto.addRow(
    { Type: "Bruto salaris", Bedrag_met: Math.round(brutoSalaris() * 100) / 100, bedrag_zonder: Math.round(brutoSalarisZonderVerlof() * 100) / 100 },
    { separator: true },
  );
  tableBrutoNetto.addRow(
    { Type: "Netto salaris", Bedrag_met: Math.round(nettoSalaris() * 100) / 100, bedrag_zonder: Math.round(nettoSalarisZonderVerlof() * 100) / 100 },
    { separator: true },
  );
  //tableBrutoNetto.addRow({ Type: "Woon-werk", Bedrag_met: Math.round(vergoedingWwk() * 100) / 100, bedrag_zonder: Math.round(vergoedingWwk() * 100) / 100 }, { separator: true });
  tableBrutoNetto.addRow(
    {
      Type: "Te betalen salaris",
      Bedrag_met: Math.round(teBetalenSalaris() * 100) / 100,
      bedrag_zonder: Math.round(teBetalenSalarisZonderVerlof() * 100) / 100,
    },
    { separator: true },
  );

  table.printTable();
  tableGrondslagen.printTable();
  tableVerlof.printTable();
  tableBrutoNetto.printTable();
}

bedragenInConsole();

testBtn1.addEventListener("click", () => {
  console.log(naam(), adres());
});

function resultaatBerekenen() {
  const brutoZonderVerlof = brutoSalarisZonderVerlof();
  const nettoZonderVerlof = nettoSalarisZonderVerlof();
  const teBetalenZonderVerlof = teBetalenSalarisZonderVerlof();
  const brutoMetVerlof = brutoSalaris();
  const nettoMetVerlof = nettoSalaris();
  const teBetalenMetVerlof = teBetalenSalaris();
  const verschil = teBetalenZonderVerlof - teBetalenMetVerlof;
  console.log("naam :", naam(), "adres:", adres().straat);

  $("#resultaat-naam").text(naam() !== "" ? naam() : "");
  $("#resultaat-bruto-salaris-met-verlof").text(FormateerGetallen.valuta(brutoMetVerlof));
  $("#resultaat-netto-salaris-met-verlof").text(FormateerGetallen.valuta(nettoMetVerlof));
  $("#resultaat-te-betalen-met-verlof").text(FormateerGetallen.valuta(teBetalenMetVerlof));

  $("#resultaat-bruto-salaris-zonder-verlof").text(FormateerGetallen.valuta(brutoZonderVerlof));
  $("#resultaat-netto-salaris-zonder-verlof").text(FormateerGetallen.valuta(nettoZonderVerlof));
  $("#resultaat-te-betalen-zonder-verlof").text(FormateerGetallen.valuta(teBetalenZonderVerlof));
  $("#resultaat-verschil").text(FormateerGetallen.valuta(verschil));
  $("#resultaat-kost").text(FormateerGetallen.valuta(verschil));

  loonstrookVullen();
}

function loonstrookVullen() {
  const brutoMetVerlof = brutoSalaris();
  $("#loonstrook-naam").text(naam() !== "" ? naam() : "Naam");
  $("#loonstrook-straat").text(adres().straat !== "" ? adres().straat : "Straatnaam");
  $("#loonstrook-top-bruto").text(FormateerGetallen.valuta(brutoMetVerlof));
  $("#loonstrook-top-te-betalen").text(FormateerGetallen.valuta(teBetalenSalaris()));

  console.log(brutoMetVerlof)
}

loonstrookVullen();

// resultaatBerekenen();

// updateBerekeningen();

const modalSoortStrook = document.getElementById("modal-soort-strook");

document.getElementById("info-type-strook").onclick = () => {
  modalSoortStrook.classList.remove("hidden");
  modalSoortStrook.classList.add("flex");
};

document.getElementById("closeModal").onclick = () => {
  modalSoortStrook.classList.add("hidden");
};

modalSoortStrook.addEventListener("click", (e) => {
  if (e.target === modalSoortStrook) {
    modalSoortStrook.classList.add("hidden");
  }
});

const modalPrivacy = document.getElementById("modal-privacy");

document.getElementById("btn-privacy").onclick = () => {
  modalPrivacy.classList.remove("hidden");
  modalPrivacy.classList.add("flex");
};

document.getElementById("sluit-privacy").onclick = () => {
  modalPrivacy.classList.add("hidden");
};

modalPrivacy.addEventListener("click", (e) => {
  if (e.target === modalPrivacy) {
    modalPrivacy.classList.add("hidden");
  }
});

const modalAfwijkendePercentageOv = document.getElementById("modal-info-afwijkend-percentage-ov");

document.getElementById("btn-info-afwijkend-percentage-ov").onclick = () => {
  modalAfwijkendePercentageOv.classList.remove("hidden");
  modalAfwijkendePercentageOv.classList.add("flex");
  console.log("test afw perc");
};

document.getElementById("closeModal-afwijkend-percentage-ov").onclick = () => {
  modalAfwijkendePercentageOv.classList.add("hidden");
};

modalAfwijkendePercentageOv.addEventListener("click", (e) => {
  if (e.target === modalAfwijkendePercentageOv) {
    modalAfwijkendePercentageOv.classList.add("hidden");
  }
});

const modalResultaat = document.getElementById("modal-resultaat");

$("#btn-resultaat").on("click", function () {
  resultaatBerekenen();
  modalResultaat.classList.remove("hidden");
  modalResultaat.classList.add("flex");
});

$("#btn-sluit-resultaat").on("click", function () {
  modalResultaat.classList.add("hidden");
  console.log("het werkt");
});

modalResultaat.addEventListener("click", (e) => {
  if (e.target === modalResultaat) {
    modalResultaat.classList.add("hidden");
  }
});

const modalLoonstrook = document.getElementById("modal-loonstrook");

$("#btn-loonstrook").on("click", function () {
  resultaatBerekenen();
  loonstrookVullen();
  modalLoonstrook.classList.remove("hidden");
  modalLoonstrook.classList.add("flex");
});

$("#closeModalLoonstrook").on("click", function () {
  modalLoonstrook.classList.add("hidden");
});

modalLoonstrook.addEventListener("click", (e) => {
  if (e.target === modalLoonstrook) {
    modalLoonstrook.classList.add("hidden");
  }
});

$("#seniorenverlof-actief").on("change", function () {
  $("#seniorenverlof-sectie").toggleClass("hidden grid");
  if (!$("#seniorenverlof-actief").prop("checked")) {
    $("#select-seniorenverlof").prop("selectedIndex", 0);
  }
  dubbelCheckVerlof();
});

$("#ouderverlof-actief").on("change", function () {
  $("#ouderverlof-sectie").toggleClass("hidden grid");
  if (!$("#ouderverlof-actief").prop("checked")) {
    $("#select-ouderverlof").prop("selectedIndex", 0);
    disableOnnodigeElementen();
  }
  dubbelCheckVerlof();
});

function toggleVerlofSecties() {
  if ($("#seniorenverlof-actief").prop("checked")) {
    $("#seniorenverlof-sectie").removeClass("hidden").addClass("grid");
  }
  if ($("#ouderverlof-actief").prop("checked")) {
    $("#ouderverlof-sectie").removeClass("hidden").addClass("grid");
  }
}

toggleVerlofSecties();

//* LOONSTROOK FUNCTIES
const maandEnJaar = () => {
  const vandaag = new Date();
  const maand = vandaag.toLocaleString("default", { month: "long" });
  const jaar = vandaag.getFullYear();
  return `${capitalize(maand)} ${jaar}`;
};

$("#maand-en-jaar").text(maandEnJaar());

$("#loonstrook-naam").text(naam() !== "" ? naam() : "Naam");
