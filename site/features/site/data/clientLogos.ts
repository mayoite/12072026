/** Maps roster display names → files under public/images/client-logos/. */
export const CLIENT_LOGO_SRC_BY_NAME: Readonly<Record<string, string>> = {
  "Ambuja Neotia": "/images/client-logos/AmbujaNeotia.png",
  "Annapurna Finance": "/images/client-logos/AnnapurnaMicroFinance.jpg",
  "Bureau of Indian Standards": "/images/client-logos/BIS.jpg",
  BIS: "/images/client-logos/BIS.jpg",
  BSPHCL: "/images/client-logos/BSPHCL.jpg",
  "Canara Bank": "/images/client-logos/CanaraBank.jpg",
  "Corporation Bank": "/images/client-logos/CorporationBank.jpg",
  "CRI Pumps": "/images/client-logos/CRIPumps.jpg",
  "Customs and Central Excise": "/images/client-logos/CustomsandCentralExcise.jpg",
  "D. Goenka School": "/images/client-logos/GDGoenka.jpg",
  "Essel Utilities": "/images/client-logos/EsselUtilities.jpg",
  "FHI 360": "/images/client-logos/FHI360.png",
  "Franklin Templeton": "/images/client-logos/FranklinTempleton.jpg",
  "Franklin Templeton Investments": "/images/client-logos/FranklinTempleton.jpg",
  "Government of Bihar": "/images/client-logos/BiharGovernment.jpg",
  "Bihar Government": "/images/client-logos/BiharGovernment.jpg",
  HDFC: "/images/client-logos/HDFCLogo.jpg",
  "HDFC Bank": "/images/client-logos/HDFCLogo.jpg",
  Hyundai: "/images/client-logos/HyundaiLogo.jpg",
  "IDBI Bank": "/images/client-logos/IDBIBankLogo.png",
  "Income Tax Department": "/images/client-logos/IncomeTaxdepartment.png",
  IndianOil: "/images/client-logos/GOILogo.jpg",
  "Indian Oil": "/images/client-logos/GOILogo.jpg",
  JSW: "/images/client-logos/JSW.png",
  "L&T": "/images/client-logos/LandT.png",
  "Larsen & Toubro": "/images/client-logos/LandT.png",
  "Maruti Suzuki": "/images/client-logos/MarutiSuzuki.png",
  MECON: "/images/client-logos/MECON.jpg",
  "Paradeep Phosphates": "/images/client-logos/ParadeepPhospates.jpg",
  SAIL: "/images/client-logos/SAIL.png",
  Shriram: "/images/client-logos/ShriramTransportFianance.png",
  "SITI Networks": "/images/client-logos/SITICable.png",
  Sonalika: "/images/client-logos/Sonalika.jpg",
  "Sonalika International": "/images/client-logos/Sonalika.jpg",
  "Survey of India": "/images/client-logos/SurveyofIndia.jpg",
  "Syndicate Bank": "/images/client-logos/SyndicateBank.png",
  "Tata Motors": "/images/client-logos/TataMotors.jpg",
  Titan: "/images/client-logos/Titan.png",
  "Ujjivan Small Finance Bank": "/images/client-logos/UjjivanBank.jpg",
  Usha: "/images/client-logos/USHA.png",
  "Usha International": "/images/client-logos/USHA.png",
  "United Bank of India": "/images/client-logos/UnitedBankofIndia.png",
};

export function resolveClientLogoSrc(name: string, explicitSrc?: string): string | undefined {
  if (explicitSrc) return explicitSrc;
  const direct = CLIENT_LOGO_SRC_BY_NAME[name];
  if (direct) return direct;
  // Case-insensitive fallback
  const lower = name.trim().toLowerCase();
  for (const [key, src] of Object.entries(CLIENT_LOGO_SRC_BY_NAME)) {
    if (key.toLowerCase() === lower) return src;
  }
  return undefined;
}
