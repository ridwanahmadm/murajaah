// No Quran text is generated or bundled. Future integrations must verify provider terms.
export interface QuranProvider { getAyah(reference:{surah:number;ayah:number}):Promise<{text:string;sourceUrl:string}> }
