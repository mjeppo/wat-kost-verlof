import Toast from "./utils";
import { FormateerGetallen } from "./utils";
import { updateBerekeningen } from "./main";

pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

const uploadInput = document.getElementById("pdfUpload");
const analyzeBtn = document.getElementById("analyzeBtn");
const debugOutput = document.getElementById("debugOutput");
const chooseFileBtn = document.getElementById("chooseFileBtn");
const fileNameDisplay = document.getElementById("fileNameDisplay");

let uploadedFile = null;
let lastExtractedData = null;

chooseFileBtn.addEventListener("click", () => {
  uploadInput.click();
});

uploadInput.addEventListener("change", (e) => {
  const file = e.target.files[0];

  if (!file) {
    fileNameDisplay.textContent = "Geen bestand gekozen";
    return;
  }

  fileNameDisplay.textContent = "Bestandsnaam: " + file.name;

  const verbodenWoordenRegex = /(concept|pro\s*forma|proef)/i;

  if (verbodenWoordenRegex.test(file.name)) {
    // alert("Let op: dit lijkt een concept / pro forma loonstrook.");
    Toast.warning(
      "Het lijkt erop dat je een conceptstrook hebt geüpload. De gegevens zijn mogelijk niet accuraat. Probeer een definitieve versie van de loonstrook te uploaden voor de beste resultaten.",
      6000,
    );

    // eventueel resetten
    // uploadInput.value = null;
    fileNameDisplay.textContent = "CONCEPTSTROOK? : " + file.name;
    fileNameDisplay.style.color = "red";
    analyzeBtn.classList.remove("btn-info");
    // analyzeBtn.classList.add("btn-outline-info");
    analyzeBtn.classList.add("btn-warning");
  } else {
    fileNameDisplay.style.color = "green";
    analyzeBtn.classList.remove("btn-outline-info");
    analyzeBtn.classList.remove("btn-warning");
  }

  analyzeLoonstrook(file);
});

uploadInput.addEventListener("change", (e) => {
  debugOutput.textContent = "";
  document.getElementById("previewCard").classList.add("hidden");
  uploadedFile = e.target.files[0];
  if (uploadedFile && uploadedFile.type === "application/pdf") {
    analyzeBtn.disabled = false;
    analyzeBtn.classList.remove("btn-outline-info");
    analyzeBtn.classList.add("btn-info");
  }
});

// analyzeBtn.addEventListener("click", async () => {
//   console.log("klik");
//   if (!uploadedFile) {
//     Toast.error("Kies eerst een PDF-bestand om te analyseren.");
//     return;
//   }

//   const arrayBuffer = await uploadedFile.arrayBuffer();
//   const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

//   let fullText = "";

//   for (let i = 1; i <= pdf.numPages; i++) {
//     const page = await pdf.getPage(i);
//     const textContent = await page.getTextContent();
//     const pageText = textContent.items.map((item) => item.str).join(" ");
//     fullText += pageText + "\n";
//   }

//   if (!isLoonstrook(fullText)) {
//     Toast.error("Het geüploade PDF-bestand lijkt geen loonstrook te zijn. Zorg ervoor dat je een geldige loonstrook uploadt.");
//     fileNameDisplay.textContent = "Geen loonstrook gedetecteerd. Extractie overgeslagen.";
//     return;
//   }

//   if (isConceptStrook(fullText)) {
//     const fileInput = document.getElementById("pdfUpload");

//     Toast.warning(
//       "Het lijkt erop dat je een conceptstrook hebt geüpload. De gegevens zijn mogelijk niet accuraat. Probeer een definitieve versie van de loonstrook te uploaden voor de beste resultaten.",
//     );
//     document.getElementById("debugOutput").textContent = "Conceptstrook gedetecteerd. Extractie overgeslagen.";
//     fileInput.value = null;
//     return;
//   }

//   debugOutput.textContent = fullText;

//   const payrollData = extractPayrollData(fullText);

//   //* VOORBEELD: TONEN INVOER VOORBEELD
//   if (payrollData) {
//     document.getElementById("previewCard").classList.remove("hidden");
//     document.getElementById("previewSchaal").textContent = payrollData.schaal;
//     document.getElementById("previewWtf").textContent = FormateerGetallen.decimalen4(payrollData.wtf);
//     document.getElementById("previewAbp").textContent = payrollData.abpJaarinkomen.toLocaleString("nl-NL");
//     document.getElementById("previewBasis").textContent = payrollData.basisSalaris.toLocaleString("nl-NL");
//     document.getElementById("previewLhk").textContent = payrollData.loonheffingskorting ? "Ja" : "Nee";
//     const totaalReiskosten = sumObjectValues(payrollData.reiskosten);
//     document.getElementById("previewReiskosten").textContent = totaalReiskosten.toFixed(2);
//     const totaalThuiswerk = sumObjectValues(payrollData.thuiswerkvergoeding);
//     document.getElementById("previewThuiswerkvergoeding").textContent = totaalThuiswerk.toFixed(2);
//     document.getElementById("previewAanvZiektekosten").textContent = payrollData.aanvZiektekosten ? " Ja" : "Nee";
//     document.getElementById("previewEhbo").textContent = payrollData.ehboToelage ? " Ja" : "Nee";
//     document.getElementById("previewBhv").textContent = payrollData.bhvVergoeding ? " Ja" : "Nee";
//     document.getElementById("previewUitDienstDatum").textContent = payrollData.uitDienstDatum || "Niet gevonden";
//   }

//   lastExtractedData = payrollData;

//   if (lastExtractedData) {
//     document.getElementById("applyDataBtn").disabled = false;
//     document.getElementById("applyDataBtn").classList.remove("btn-outline-success");
//     document.getElementById("applyDataBtn").classList.add("btn-success");
//   }

//   console.log(payrollData);
// });

async function analyzeLoonstrook(file) {
  if (!file) return;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    fullText += textContent.items.map((item) => item.str).join(" ");
  }

  // Concept check
  if (/(concept|pro\s*forma|proef)/i.test(fullText)) {
    // Toast.warning("Deze loonstrook is een concept/pro forma.");
    resetLoonstrookUpload();
    return;
  }

  debugOutput.textContent = fullText;

  const payrollData = extractPayrollData(fullText);

  lastExtractedData = payrollData;

  if (lastExtractedData) {
    document.getElementById("applyDataBtn").disabled = false;
    document.getElementById("applyDataBtn").classList.remove("btn-outline-success");
    document.getElementById("applyDataBtn").classList.add("btn-success");
    document.getElementById("applyDataBtn2").disabled = false;
    document.getElementById("applyDataBtn2").classList.remove("btn-outline-success");
    document.getElementById("applyDataBtn2").classList.add("btn-success");
    document.getElementById("opvulling").classList.add("hidden");
  }

  if (!document.getElementById("keuze-eerst-analyse").checked) {
    document.getElementById("extra-knop-voor-verwerking").classList.remove("hidden");
    return;
  } else {
    showPreview(payrollData);
    // document.getElementById("extra-knop-voor-verwerking").classList.add("hidden");
  }

  parsePayroll(fullText);
}

document.getElementById("debugOutput").addEventListener("click", () => {
  const text = document.getElementById("debugOutput").textContent;
  if (!text || text.trim() === "") return;
  navigator.clipboard
    .writeText(text)
    .then(() => {
      Toast.success("Tekst gekopieerd naar clipboard!");
    })
    .catch((err) => {
      Toast.error("Fout bij kopiëren: " + err);
    });
});

function showPreview(payrollData) {
  if (!payrollData) return;
  let fullText = "";

  document.getElementById("previewCard").classList.remove("hidden");
  document.getElementById("previewNaam").textContent = payrollData.naam;
  document.getElementById("previewNummer").textContent = payrollData.nummer;
  document.getElementById("previewSchaal").textContent = payrollData.schaal;
  document.getElementById("previewWtf").textContent = FormateerGetallen.decimalen4(payrollData.wtf);
  document.getElementById("previewAbp").textContent = FormateerGetallen.valuta(payrollData.abpJaarinkomen);
  document.getElementById("previewBasis").textContent = FormateerGetallen.valuta(payrollData.basisSalaris);
  document.getElementById("previewLhk").textContent = payrollData.loonheffingskorting ? "Ja" : "Nee";
  const totaalReiskosten = sumObjectValues(payrollData.reiskosten);
  document.getElementById("previewReiskosten").textContent = FormateerGetallen.valuta(totaalReiskosten);
  const totaalThuiswerk = sumObjectValues(payrollData.thuiswerkvergoeding);
  document.getElementById("previewThuiswerkvergoeding").textContent = FormateerGetallen.valuta(totaalThuiswerk);
  document.getElementById("previewAanvZiektekosten").textContent = payrollData.aanvZiektekosten
    ? `Ja (${FormateerGetallen.valuta(payrollData.aanvZiektekostenBedrag)})`
    : "Nee";
  document.getElementById("previewEhbo").textContent = payrollData.ehboToelage ? " Ja" : "Nee";
  document.getElementById("previewBhv").textContent = payrollData.bhvVergoeding ? " Ja" : "Nee";
  document.getElementById("previewUitDienstDatum").textContent = payrollData.uitDienstDatum || "Niet van toepassing";
  document.getElementById("previewAov").textContent = payrollData.aov.preview ? payrollData.aov.preview : "Nee";
  document.getElementById("previewBrutoInhoudingen").textContent = FormateerGetallen.valuta(payrollData.brutoInhoudingen);
}

//* EXTRACTIE FUNCTIES

function extractPayrollData(text) {
  return {
    naam: extractNaamEnNummer(text)?.naam || extractNaam(text) || "Niet gevonden",
    nummer: extractNaamEnNummer(text)?.nummer || "Niet gevonden",
    straat: extractAdres(text)?.straatHuisnummer || "Niet gevonden",
    postcode: extractAdres(text)?.postcode || "Niet gevonden",
    woonplaats: extractAdres(text)?.woonplaats || "Niet gevonden",
    woonland: extractAdres(text)?.woonland || "Niet gevonden",
    schaal: extractSchaal(text),
    wtf: extractWTF(text),
    abpJaarinkomen: extractABPJaarinkomen(text),
    basisSalaris: extractBasisSalaris(text),
    loonheffingskorting: extractLoonheffingskorting(text),
    reiskosten: extractReiskosten(text),
    thuiswerkvergoeding: extractThuiswerkvergoeding(text),
    aanvZiektekosten: extractAanvZiektekosten(text),
    aanvZiektekostenBedrag: extractAanZiektekostenBedrag(text),
    ehboToelage: extractEhboVToelage(text),
    bhvVergoeding: extractBhvVergoeding(text),
    uitDienstDatum: extractUitDienstDatum(text),
    aov: extractAov(text),
    fiets: extractFiets(text),
    fitness: extractFitness(text),
    brutoInhoudingen: brutoInhoudingen(text),
  };
}

let payrollData = {};

export function parsePayroll(text) {
  payrollData = extractPayrollData(text);
}

export function naam() {
  return payrollData.naam !== undefined ? payrollData.naam + " (" + payrollData.nummer + ")" : "";
}

export function adres() {
  const straat = payrollData.straat || "";
  const postcode = payrollData.postcode || "";
  const woonplaats = payrollData.woonplaats || "";
  const woonland = payrollData.woonland || "";
  return { straat, postcode, woonplaats, woonland };
}

function parseDutchNumber(value) {
  if (!value) return null;

  return parseFloat(
    value
      .replace(/\./g, "") // verwijder duizendtallen
      .replace(",", "."), // komma → punt
  );
}

document.getElementById("handmatigGegevensInvoerenBtn").addEventListener("click", () => {
  document.getElementById("invoer-sectie").classList.remove("hidden");
  document.getElementById("previewCard").classList.add("hidden");
  document.getElementById("extra-knop-voor-verwerking").classList.add("hidden");
  document.getElementById("applyDataBtn2").classList.add("hidden");
  document.getElementById("handmatigGegevensInvoerenBtn").classList.add("hidden!");
});

function extractDienstverbandBlokken(text) {
  const regex = /DV\d+[\s\S]*?(?=DV\d+|$)/g;
  return text.match(regex) || [];
}

function extractSchaalUitBlok(blok) {
  const match = blok.match(/\d{2}-\d{2}-\d{4}\s+([\d,]+)[\s\S]*?(\d+)\.?\s+(\d+)\s+[\d,]+/);

  if (!match) return null;

  return {
    wtf: parseDutchNumber(match[1]),
    loonschaal: parseInt(match[2], 10),
    functieschaal: parseInt(match[3], 10),
    schaal: `${match[2]}.${match[3]}`,
  };
}

function extractWTF(text) {
  const match = text.match(/DV\d+\s+\d{2}-\d{2}-\d{4}\s+([\d,]+)/);
  return match ? parseDutchNumber(match[1]) : null;
}

function extractSchaal(text) {
  const dvBlok = text.match(/DV\d+[\s\S]*?(?=Onbepaalde|Bepaalde|$)/);

  if (!dvBlok) return null;

  const match = dvBlok[0].match(/([A-Z]+|\d+)\.\s+(\d+)/);

  if (!match) return null;

  return `${match[1]}.${match[2]}`;
}

function extractBasisSalaris(text) {
  const match = text.match(/Basis salaris:\s+([\d.,]+)/);
  return match ? parseDutchNumber(match[1]) : null;
}

function extractABPJaarinkomen(text) {
  const match = text.match(/([\d.,]+)\s+(Onbepaalde|Bepaalde)\s+tijd/);

  return match ? parseDutchNumber(match[1]) : null;
}

function extractLoonheffingskorting(text) {
  const match = text.match(/Toepassen Loonheffingskorting:\s+[\d.,]+\s+(Ja|Nee)/);
  return match ? match[1] === "Ja" : null;
}

function extractReiskosten(text) {
  const regex = /Reiskosten wn-wrk\s+(\w+)\s+([\d.,]+)/g;

  let match;
  const result = {};

  while ((match = regex.exec(text)) !== null) {
    const dag = match[1].toLowerCase();
    result[dag] = parseDutchNumber(match[2]);
  }

  return result;
}

function extractThuiswerkvergoeding(text) {
  const regex = /Thuiswerkvergoeding\s+(\w+)\s+([\d.,]+)/g;

  let match;
  const result = {};

  while ((match = regex.exec(text)) !== null) {
    const dag = match[1].toLowerCase();
    result[dag] = parseDutchNumber(match[2]);
  }

  return result;
}

function extractAanvZiektekosten(text) {
  return /Aanv\.\s+ziektekostenverzekering/.test(text);
}

function extractAanZiektekostenBedrag(text) {
  const match = text.match(/Aanv. ziektekostenverzekering\s+([\d.,]+)/);
  return match ? parseDutchNumber(match[1]) : null;
}

function extractEhboVToelage(text) {
  return /EHBO-toelage/i.test(text);
}

function extractBhvVergoeding(text) {
  return /bhv\s+vergoeding/i.test(text);
}

function extractUitDienstDatum(text) {
  const match = text.match(/Uit dienst met ingang van:\s*(\d{2}-\d{2}-\d{4})/);

  if (!match) return null;

  const [dag, maand, jaar] = match[1].split("-");
  return new Date(`${jaar}-${maand}-${dag}`);
}

function extractAov(text) {
  const match = text.match(/AOV Loyalis\s+(-?[\d.,]+)/);
  if (!match) {
    return {
      preview: "Nee",
      verwerking: "geen",
    };
  }
  const abp = parseFloat(extractGrondslagAov(text)) || 0;
  const premie = parseDutchNumber(match[1]);
  const premiePositief = premie * -1;
  const percentage = Math.round((premiePositief / abp) * 100000) / 1000;
  let soortAovTekst = "Geen";
  let soortAov = "geen";
  if (percentage > 0.8) {
    soortAovTekst = "Compleet (0,824%)";
    soortAov = "premie_aov_3_string";
  } else if (percentage > 0.42) {
    soortAovTekst = "Gedeeltelijk ao (0,432%)";
    soortAov = "premie_aov_1_string";
  } else if (percentage > 0.39) {
    soortAovTekst = "Volledig ao (0,392%)";
    soortAov = "premie_aov_2_string";
  }

  //console.log("premie:", premie, "abp:", abp, " percentage:", percentage, "soortAov:", soortAovTekst, "grondslag:", extractGrondslagAov(text));

  return {
    preview: match ? " Ja: " + soortAovTekst : "Nee",
    verwerking: soortAov,
  };
}

function extractGrondslagAov(text) {
  const regex = /BRUTOLOON[\s\S]*?\d+,\d+%\s+(-?\d{1,3}(?:\.\d{3})*,\d{2})/g;

  const matches = [...text.matchAll(regex)];

  if (matches.length < 2) return null;

  return parseDutchNumber(matches[1][1]);
}

function extractFitness(text) {
  const match = text.match(/Inhouding salaris i\.v\.m\. fitness abonnement\s+(-?[\d.,]+)/);
  if (!match) return 0;
  return parseDutchNumber(match[1]) * -1;
}

function extractFiets(text) {
  const match = text.match(/Inhouding salaris i.v.m fietsplan\s+(-?[\d.,]+)/);
  if (!match) return 0;
  return parseDutchNumber(match[1]) * -1;
}

export function extractNaamEnNummer(text) {
  const match = text.match(/Woonland:\s+[A-Za-z\s]+?\s+€\s*[\d.,]+\s+€\s*[\d.,]+\s+(.+?)\s*\((\d+)\)/);

  if (!match) return null;

  return {
    naam: match[1].trim(),
    nummer: match[2],
  };
}



function extractAdres(text) {
  const regex = /TE BETALEN LOON\s+(.+?)\s+(\d{4}\s?[A-Z]{2})\s+([A-Z][A-Z\s\-]+?)\s+Woonland:\s*([A-Za-z\s]+)/i;
  const match = text.match(regex);

  if (!match) return null;

  return {
    straatHuisnummer: match[1].trim(),
    postcode: match[2].trim(),
    woonplaats: match[3].trim(),
    woonland: match[4].trim(),
  };
}

export const mdwStraat = () => {
  return extractAdres.straatHuisnummer;
}

function brutoInhoudingen(text) {
  return extractFiets(text) + extractFitness(text);
}

function isLoonstrook() {
  return /loonstrook/i.test(text);
}

function isConceptStrook(text) {
  return /dienstverbanden\s+concept/i.test(text);
}

//* HULPFUNCTIES
function sumObjectValues(obj) {
  if (!obj) return 0;

  return Object.values(obj).reduce((sum, value) => {
    return sum + (parseFloat(value) || 0);
  }, 0);
}

function gegevensToepassenOpFormulier(data) {
  if (!lastExtractedData) return;

  //@ Velden in formulier invullen
  const targetSchaal = lastExtractedData.schaal;
  $(".schaal-keuze").val(targetSchaal).trigger("change");
  //   document.getElementById("schaal-keuze").value = lastExtractedData.schaal;
  const targetAov = String(lastExtractedData.aov.verwerking);
  console.log("Gezochte AOV value:", targetAov);
  console.log("Bestaat option?", $(".aov-keuze option[value='" + targetAov + "']").length);
  $("#aov-select").val(targetAov).trigger("change");
  document.getElementById("wtf-input").value = lastExtractedData.wtf;
  document.getElementById("input-abp-jaarinkomen").value = lastExtractedData.abpJaarinkomen;
  document.getElementById("inputBasisSalaris").value = lastExtractedData.basisSalaris;
  document.getElementById("loonheffingskorting").checked = lastExtractedData.loonheffingskorting;
  const totaalReiskosten = sumObjectValues(lastExtractedData.reiskosten || {});
  document.getElementById("input-reiskosten-wwk").value = totaalReiskosten.toFixed(2).replace(".", ",");
  const totaalThuiswerk = sumObjectValues(lastExtractedData.thuiswerkvergoeding || {});
  document.getElementById("input-thuiswerkvergoeding").value = totaalThuiswerk.toFixed(2).replace(".", ",");
  document.getElementById("aanvullende-ziektekosten").checked = !!lastExtractedData.aanvZiektekosten;
  document.getElementById("ehbo-vergoeding").checked = !!lastExtractedData.ehboToelage;
  document.getElementById("bhv-vergoeding").checked = !!lastExtractedData.bhvVergoeding;
  document.getElementById("input-bruto-inhouding").value = lastExtractedData.brutoInhoudingen.toFixed(2).replace(".", ",");

  //@ Instellen knoppen/status
  Toast.success("Gegevens succesvol toegepast!");
  document.getElementById("applyDataBtn").disabled = true;
  document.getElementById("applyDataBtn").classList.remove("btn-success");
  document.getElementById("applyDataBtn").classList.add("btn-outline-success");
  document.getElementById("previewCard").classList.add("hidden");
  $("#invoer-sectie").removeClass("hidden");
  $("#applyDataBtn2").addClass("hidden!");
  $("#handmatigGegevensInvoerenBtn").addClass("hidden!");

  updateBerekeningen();
}

//* GEGEVENS TOEPASSEN OP FORMULIER
document.getElementById("applyDataBtn2").addEventListener("click", () => {
  gegevensToepassenOpFormulier();
});

$("#applyDataBtn").on("click", () => {
  gegevensToepassenOpFormulier();
});
