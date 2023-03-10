import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { CreateCampaignComponent } from './components/create-campaign/create-campaign.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { DiceRollerComponent } from './components/dice-roller/dice-roller.component';
import { PartyComponent } from './components/party/party.component';
import { TitlePipe } from './pipes/title.pipe';
import { UsefulLinksComponent } from './components/useful-links/useful-links.component';
import { InitiativeTrackerComponent } from './components/initiative-tracker/initiative-tracker.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CreateCampaignComponent,
    DiceRollerComponent,
    PartyComponent,
    TitlePipe,
    UsefulLinksComponent,
    InitiativeTrackerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    DragDropModule,
    MatSlideToggleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
