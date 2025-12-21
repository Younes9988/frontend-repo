export interface Emprunt {
  id: number;
  lecteurId: number;
  livreId: number;
  dateEmprunt: string;
  dateRetourPrevue: string;
  dateRetourEffective?: string;
  statutEmprunt: 'EN_COURS' | 'RETOURNE' | 'EN_RETARD';
  penalite: number;
}
