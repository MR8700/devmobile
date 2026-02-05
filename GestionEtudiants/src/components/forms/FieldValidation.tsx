export const isIneValid = (v: string) => /^N\d{11}$/.test(v.trim());
 export const isNameValid = (v: string) => /^[A-Za-zÀ-ÖØ-öø-ÿ]{2,50}$/.test(v.trim());
export  const isAgeValid = (v: string) => /^\d+$/.test(v) && parseInt(v) >= 12 && parseInt(v) <= 99;
 export const isPhoneValid = (v: string) => /^\d{8,15}$/.test(v.trim());
 export const isFiliereValid = (v: string) => /^[A-Za-zÀ-ÖØ-öø-ÿ ]{2,50}$/.test(v.trim());