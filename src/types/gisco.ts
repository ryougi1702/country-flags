export type CountryProperties = {
  CNTR_ID: string | null; // Country ID in ISO2 (e.g., "AD")
  CNTR_NAME: string | null; // Country name (e.g., "Andorra")
  NAME_ENGL: string | null; // English name
  NAME_FREN: string | null; // French name
  ISO3_CODE: string | null; // ISO 3-letter code (e.g., "AND")
  SVRG_UN: string | null; // Sovereignty/UN status (e.g., "UN Member State")
  CAPT: string | null; // Capital city (e.g., "Andorra la Vella")
  EU_STAT: string | null; // EU status (e.g., "F")
  EFTA_STAT: string | null; // EFTA status (e.g., "F")
  CC_STAT: string | null; // CC status (e.g., "F")
  NAME_GERM: string | null; // German name
};
