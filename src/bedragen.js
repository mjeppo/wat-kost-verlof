export const bedragen = 
    {
    "franchise_pensioen": 19200,
    "franchise_aop": 29700,
    "premie_pensioen": 8.13,
    "premie_aop": 0.3,
    "premie_penioen_wg": 18.97,
    "premie_aop_wg": 0.7,
    "premie_aov_1": 0.0054,
    "premie_aov_2": 0.0049,
    "premie_aov_3": 0.0103,
    "korting_aov": 0.2,
    "ziektekosten": 40.26,
    "aanvullende_ziektekosten": 21.09,
    "EHBO": 13.78,
    "BHV": 6.89,
    "thuiswerk": 8.56,
    "telefoonvergoeding": 10.00,
    "thuiswerkvergoeding": 8.73,
    "percentage_werknemersdeel_pensioen": 0.4,
    "uren_per_week": 36.86,
    "weken_per_maand": 4.25,
    }
    
export const aov_premies_strings = {
    "geen" : "Geen AOV",
    "premie_aov_1_string": `Gedeeltelijk (${(bedragen.premie_aov_1 * 100 * (1 - bedragen.korting_aov)).toFixed(3).replace(".", ",") }%)`,
    "premie_aov_2_string": `Volledig (${(bedragen.premie_aov_2 * 100 * (1 - bedragen.korting_aov)).toFixed(3).replace(".", ",") }%)`,
    "premie_aov_3_string": `Beide (${(bedragen.premie_aov_3 * 100 * (1 - bedragen.korting_aov)).toFixed(3).replace(".", ",")}%)`,
    
}
    
const aovSelect = document.getElementById("aov-select");

Object.keys(aov_premies_strings).forEach((key) => {
    const optionElement = document.createElement("option");
    optionElement.textContent = aov_premies_strings[key];
    optionElement.value = key;
    aovSelect.appendChild(optionElement);
})