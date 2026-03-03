import { schalenArray2025_1, witte_tabel_2026 } from "./schalen.js";
import "./style.css";
import {
  FormateerGetallen,
  formatInput,
  checkInput,
  checkInputLeegMag,
  privacyStatementToggle
} from "./utils";
import { bedragen, aov_premies_strings } from "./bedragen";
import Toast from "./utils";
import { printTable, Table } from "console-table-printer";

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
const selectedOption =
  schaalDropdown.options[schaalDropdown.selectedIndex];

let schaalBedrag = selectedOption.dataset.salaris;



$("#schaal-keuze").on("change", function () {
  const selectedOption = this.options[this.selectedIndex];
  const salaris = selectedOption.dataset.salaris;
console.log(' salaris: ', salaris);
  document.getElementById("inputBasisSalaris").value = salaris;
  bedragenInConsole();
  maandBedragBruto();
  schaalBedrag = salaris;
  document.getElementById("salaris-uit-uren-gewerkt").textContent = FormateerGetallen.valuta(salaris * wtf());
  updateBerekeningen();
});

document.getElementById("inputBasisSalaris").value =
  selectedOption.dataset.salaris;


const wtf = () => {
  return wtfEl.value ? parseFloat(wtfEl.value.replace(",", ".")) : 0;
};

const normBedrag = () => {
  return parseFloat(schaalDropdown.value);
};

const maandBedragBruto = () => {
  console.log('maandbedrag: ',schaalBedrag, wtf());
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
  return document.getElementById("input-netto-vergoeding").value
    ? parseFloat(document.getElementById("input-netto-vergoeding").value.replace(",", "."))
    : 0;
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

const loonheffing = () => {
  const bel_inkomen = belastbaarInkomen();
  const gesorteerd = witte_tabel_2026.sort((a, b) => a.tabelloon - b.tabelloon);
  const met_korting = document.getElementById("loonheffingskorting").checked;
  let resultaat = null;

  for (let i = 0; i < gesorteerd.length; i++) {
    if (gesorteerd[i].tabelloon <= bel_inkomen) {
      resultaat = gesorteerd[i];
    } else {
      break;
    }
  }
  return met_korting ? resultaat.met_lhk : resultaat.zonder_lhk;
};

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
        return parseFloat(reiskostenWwkInputEl.value);
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

  table.printTable();
  tableGrondslagen.printTable();
  tableVerlof.printTable();
}

bedragenInConsole();

testBtn1.addEventListener("click", () => {
  bedragenInConsole();
  saveToLocalStorage();
});

document.getElementById("sophia").addEventListener("click", () => {
  Toast.success("Hallo Sophia! 👋");
});

// updateBerekeningen();


document.getElementById("btn-privacy").addEventListener("click", privacyStatementToggle);
document.getElementById("sluit-privacy").addEventListener("click", privacyStatementToggle);

