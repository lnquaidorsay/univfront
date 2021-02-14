import { Categorie } from "./categorie";

export class Livre {
    id: number;

    titre: string;
    
    isbn: string;
    
    nbExemplaires: number;
    
    auteur: string;

    datePublication: Date;
    
    categorie = new Categorie();
}
