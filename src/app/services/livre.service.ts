import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Livre } from '../models/livre';
import { Categorie } from '../models/categorie';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class LivreService {

  private subjectName = new Subject<any>(); //nécessité de créer un sujet

  constructor(private http: HttpClient) { }

  sendUpdate(message: string) { //le composant qui veut mettre à jour quelque chose, appelle cette fn
    this.subjectName.next({ text: message }); //next() alimentera la valeur dans Subject
}

  getUpdate(): Observable<any> { //l'élément récepteur appelle cette fonction 
      return this.subjectName.asObservable(); //il revient comme un observable auquel la fonction de réception souscrira
  }

  /**
     * Get all book's categories as reference data from Backend server.
     */
    loadBooks(): Observable<Livre[]>{
      let headers = new HttpHeaders();
      headers.append('content-type', 'application/json');
      headers.append('accept', 'application/json');
      return this.http.get<Livre[]>(environment.apiUrl+'/rest/book/api/allbooks', {headers: headers});
  }
    
    /**
     * Get all book's categories as reference data from Backend server.
     */
     loadCategories(): Observable<Categorie[]>{
         let headers = new HttpHeaders();
         headers.append('content-type', 'application/json');
         headers.append('accept', 'application/json');
         return this.http.get<Categorie[]>(environment.apiUrl+'/rest/category/api/allCategories', {headers: headers});
     }
     
    /**
     * Save a new Book object in the Backend server data base.
     * @param livre
     */
     saveBook(livre: Livre): Observable<Livre>{
      let headers = new HttpHeaders();
      headers.append('content-type', 'application/json');
      headers.append('accept', 'application/json');
      return this.http.post<Livre>(environment.apiUrl+'/rest/book/api/addBook2', livre, {headers: headers});
     }
     
     /**
      * Update an existing Book object in the Backend server data base.
      * @param livre
      */
      updateBook2(livre: Livre): Observable<Livre>{
          return this.http.put<Livre>(environment.apiUrl+'/rest/book/api/updateBook', livre);
      }

      updateBook(livre: Livre): Observable<Livre>{
        let headers = new HttpHeaders();
        headers.append('content-type', 'application/json');
        headers.append('accept', 'application/json');
        return this.http.put<Livre>(environment.apiUrl+'/rest/book/api/updateBook2', livre, {headers: headers});
       }
      
      /**
       * Delete an existing Book object in the Backend server data base.
       * @param livre
       */
       deleteBook(livre: Livre): Observable<string>{
           return this.http.delete<string>(environment.apiUrl+'/rest/book/api/deleteBook/'+livre.id);
       }

       

     /**
      * Search books by isbn
      * @param isbn
      */
     searchBookByIsbn(isbn: string): Observable<Livre>{
         return  this.http.get<Livre>(environment.apiUrl+'/rest/book/api/searchByIsbn?isbn='+isbn);
     }
     
    /**
     * Search books by title
     * @param title
     */
     searchBookByTitle(title: string): Observable<Livre[]>{
             return this.http.get<Livre[]>(environment.apiUrl+'/rest/book/api/searchByTitle?title='+title);
     }

     form: FormGroup = new FormGroup({
      $key: new FormControl(null),
      titre: new FormControl('', Validators.required),
      auteur: new FormControl('', Validators.required),
      isbn: new FormControl('', Validators.required),
      nbExemplaires: new FormControl('', Validators.required),
      datePublication: new FormControl('', Validators.required),
      categorie: new FormControl('', Validators.required)
      
    });

    

    initializeFormGroup() {
      this.form.setValue({
        $key: null,
        titre: '',
        auteur: '',
        isbn: '',
        nbExemplaires: '',
        datePublication: '',
        categorie:0
      });
    }

    deleteAbook(bookId: number):Observable<any> {
      let url = "http://localhost:8181/book/remove";
      const httpOptions = {
        headers: new HttpHeaders({ 
          'Content-Type': 'application/json',
          'x-auth-token' : localStorage.getItem('xAuthToken')
        })
      };
      return this.http.post(url,bookId,httpOptions);
    }
  
    populateForm(livre) {
      this.form.setValue({
        $key: livre['id'],
        titre: livre['titre'],
        auteur: livre['auteur'],
        isbn: livre['isbn'],
        nbExemplaires: livre['nbExemplaires'],
        datePublication: livre['datePublication'],
        categorie:livre['categorie'].codeCategorie
      });
    }
}
