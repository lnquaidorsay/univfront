import { LivreService } from './../../services/livre.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { LivreComponent } from '../livre/livre.component';
import { Livre } from '../../models/livre';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list-livre',
  templateUrl: './list-livre.component.html',
  styleUrls: ['./list-livre.component.css']
})
export class ListLivreComponent implements OnInit {

  public pLivreList;

  livreResult: Livre[] ;

  dataSource;

  searchKey: string;

  dialogTitle: string;

  private subscriptionName: Subscription; //important de créer un abonnement

  messageReceived: any;
    

  displayedColumns: string[] = ['titre', 'auteur','isbn', 'date enregistrement', 'date publication', 'actions'];
 
  listData: MatTableDataSource<Livre>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private livreService: LivreService, public dialog: MatDialog) {
    // s'abonner aux messages du composant expéditeur(bookcomponent)
    this.subscriptionName= this.livreService.getUpdate().subscribe
    (message => { //le message contient les données envoyées depuis le service
    this.messageReceived = message; //une sorte de drapeau(flag) ici
    this.chargerLivres(); //ou ngOnInit(), quel que soit le responsable du chargement
    });
   }

  ngOnInit(): void {
    this.chargerLivres();
    this.dataSource = new MatTableDataSource<Livre>(this.livreResult);
  }

  ngOnDestroy() { //C'est une bonne pratique de se désabonner pour éviter les fuites de mémoire
            this.subscriptionName.unsubscribe();
        }

  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLowerCase();
  }

  chargerLivres(){
    console.log("list des livres avant affichage");
      this.livreService.loadBooks().subscribe(
              (result: Livre[]) => {
                console.log("list des livres : ",result);
                this.livreResult = result;
                this.listData = new MatTableDataSource(result);
                this.listData.sort = this.sort;
                this.listData.paginator = this.paginator;
                this.pLivreList=result;
              },
              error => {
                console.log("Erreur : ",error);
              }
      );
  }

  onCreate() {
    this.livreService.initializeFormGroup();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    //dialogConfig.width = "350px";
    this.dialog.open(LivreComponent,dialogConfig);
  }

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  onEdit(row){
    let myValue = 1;
    this.livreService.form.get("$key").setValue(myValue);
    let cat = row['categorie'];
    let code = cat.codeCategorie;
    let label = cat.nomCategorie;
    this.livreService.populateForm(row);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(LivreComponent,dialogConfig);
  }


  openDialog(row) {
    Swal.fire({
      title: 'Voulez-vous supprimer ce livre?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.value) {
         this.livreService.deleteBook(row).subscribe(data => {
          this.livreService.sendUpdate('A msg/flag');
          Swal.fire(
            'Effectué!',
            'Le livre a été supprimé.',
            'success'
          )
          console.log("data return with remove : ",data);
      },error => {
        console.log("Erreur lors de la suppression du livre: ",error);
      });
    } 
    })
  }

}
