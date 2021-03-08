import { ModifierLivreComponent } from './components/modifier-livre/modifier-livre.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AjoutLivreComponent } from './components/ajout-livre/ajout-livre.component';
import { InscriptionComponent } from './components/inscription/inscription.component';
import { ListLivreComponent } from './components/list-livre/list-livre.component';
import { AfterAuthGuard } from './guards/after-auth.guard';
import { AuthGuard } from './guards/auth.guard';
import { PageNotFoundComponent } from './components/partials/page-not-found/page-not-found.component';
import { LoginComponent } from './components/login/login.component';
import { PretComponent } from './components/pret/pret.component';
import { EtudiantComponent } from './components/etudiant/etudiant.component';

const routes: Routes = [
  { path: "", redirectTo: "/livres", pathMatch: "full", canActivate: [AuthGuard] },
  { path: "livres", children: [
     { path:"", component: ListLivreComponent },// http://localhost:4200/livres
     { path:"pret", component: PretComponent}, // http://localhost:4200/livres/prêt
     { path:"etudiant", component: EtudiantComponent }, // // http://localhost:4200/livres/etudiant
    ], canActivate: [AuthGuard]
  },
  { path: "login", component: LoginComponent, canActivate: [AfterAuthGuard] },
  { path: "register", component: InscriptionComponent },
  { path: "**", component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
