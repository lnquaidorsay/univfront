import { Component, Inject, OnInit } from '@angular/core';
import { LivreService } from 'src/app/services/livre.service';
import { Livre } from '../../models/livre';
import { Categorie } from '../../models/categorie';
import Swal from 'sweetalert2';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-livre',
  templateUrl: './livre.component.html',
  styleUrls: ['./livre.component.css']
})
export class LivreComponent implements OnInit {

  public monLivre = new Livre();

  constructor(public service: LivreService, private toastr: ToastrService,public dialogRef: MatDialogRef<LivreComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onSubmit() {
    if (this.service.form.valid) {
      const formValue = this.service.form.value;
      this.monLivre.auteur = formValue['auteur'];
      this.monLivre.isbn = formValue['isbn'];
      this.monLivre.categorie.codeCategorie = formValue['categorie'];
      this.monLivre.titre = formValue['titre'];
      this.monLivre.nbExemplaires = formValue['nbExemplaires'];
      var localDate = new Date(formValue['datePublication']);
      if(localDate.getTimezoneOffset() < 0){
          localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset() );
      }else{
        localDate.setMinutes(localDate.getMinutes() + localDate.getTimezoneOffset() );
      }
      console.log("get value form insert : ",this.service.form.value);
      this.monLivre.datePublication = localDate;
      if (!this.service.form.get('$key').value){
        this.saveNewBook(this.monLivre);
      }
      else {
        console.log("get $key value form update : ",this.service.form.get('$key').value);
        this.monLivre.id = this.service.form.get('$key').value;
        this.updateABook(this.monLivre);
        this.service.form.reset();
        this.service.initializeFormGroup();
      }
      this.onClose();
    }
  }

  /**
* Save new book
* @param book
*/
saveNewBook(livre: Livre){
  this.service.saveBook(livre).subscribe(
          (result: Livre) => {
             if(result.id){
              this.service.sendUpdate('A msg/flag');
                this.toastr.success(
                  `Son id est  : ${ result.id }`,
                  'Le livre a été ajouté avec succès !',
                  {
                    timeOut: 7000,
                    positionClass: 'toast-bottom-left'
                  }
                );
             }
          },
          error => {
                 this.toastr.error(
                    `Erreur`,
                    'Merci de Vérifier vos informations de saisie !',
                    {
                      timeOut: 3000,
                      positionClass: 'toast-bottom-left'
                    }
                );
               console.log("erreur survenue lors de  ajout : ",error);
          }
  );
}


  /**
* Update a book
* @param book
*/
updateABook(livre: Livre){
  this.service.updateBook(this.monLivre).subscribe(
    (result: Livre) => {
      console.log("Resultat maj livre : ",result);
     if(result.id){
      this.service.sendUpdate('A msg/flag');
      this.toastr.success(
        `Son id est  : ${ result.id }`,
        'Le livre a été mise a jour avec succès !',
        {
          timeOut: 7000,
          positionClass: 'toast-bottom-left'
        }
      );
     }
  },
    error => {
      console.log("update book est en erreur : ",error);
    }
  );
}

openDialog(livre:Livre) {
  Swal.fire({
    title: 'Voulez-vous supprimer ce livre?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Supprimer!',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.value) {
       this.service.deleteBook(livre).subscribe(data => {
        this.service.sendUpdate('A msg/flag');
        Swal.fire(
          'Effectué!',
          'Le livre a été supprimé.',
          'success'
        )
    },error => {
      console.log("Erreur lors de la suppression du livre: ",error);
    });
  } 
  })
}

  onClear() {
    this.service.form.reset();
    this.service.initializeFormGroup();
  }

  onClose() {
    this.service.form.reset();
    this.service.initializeFormGroup();
    this.dialogRef.close();
  }

  

  /**
* Save zone local date to the book releaseDate property : 
*   there is a recognized problem with datepicker @angular/material timezone conversion.
* @param book
*/
setLocalDateToDatePicker(livre: Livre){
  var localDate = new Date(livre.datePublication);
  if(localDate.getTimezoneOffset() < 0){
      localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset() );
  }else{
    localDate.setMinutes(localDate.getMinutes() + localDate.getTimezoneOffset() );
  }
  livre.datePublication = localDate;
}

}
