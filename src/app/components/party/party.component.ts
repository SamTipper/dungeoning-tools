import { Component, OnInit } from '@angular/core';
import { CampaignLoaderService } from 'src/app/services/campaign-loader.service';
import { Player } from 'src/app/interfaces/player';
import { PlayerService } from 'src/app/services/player.service';
import { HttpService } from 'src/app/services/http.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.css']
})
export class PartyComponent implements OnInit{
  players: Player[];
  changes: object = {
    abilityScore:  false,
    disableButton: true
  };
  createNewCharacter: boolean = false;
  deleteCharacter: boolean = false;
  newCharacter: Player;
  toDelete: {player: Player, index: number, deletionConfirmation: string};

  constructor(
    private campaign: CampaignLoaderService,
    private playerService: PlayerService,
    private http: HttpService,
    private toastr: ToastrService
  ) { }

  ngOnInit(){
    this.players = this.campaign.players;
    this.changes['disableButton'] = this.playerService.unsavedCharacterChanges ? false : true;
  }

  onPlayerChange(change?: string){
    if (change){
      this.changes[change] = true;
    }
    this.changes['disableButton'] = false;
    this.playerService.unsavedCharacterChanges = true;
  }

  onSaveChanges(){
    this.changes['disableButton'] = true;
    this.players.forEach((player: Player) => {
      if (this.changes['abilityScore']){
        this.playerService.generateAbilityScoreModifiers(player);
        this.playerService.generatePlayerSkills(player);
        this.playerService.generatePlayerSaves(player);
        this.playerService.getInitiative(player);
      }
    });

    this.changes['abilityScore'] = false;

    this.campaign.players = this.players;
    const changesSubscription = this.http.updateCampaign(this.campaign.campaignCode, this.campaign.campaignName, JSON.stringify(this.campaign.players)).subscribe(
      (res) => {
        if (res.status === 200){
          this.toastr.success("Changes saved successfully!");
          this.playerService.unsavedCharacterChanges = false;
          changesSubscription.unsubscribe();
        }
      },
      (error) => {
        console.log(error);
        this.toastr.error("An error has occurred when saving character changes, please try again later");
        changesSubscription.unsubscribe();
        this.changes['disableButton'] = false;
      }
    )
  }

  applyProfOrExp(player: Player, skill: string, proficiency: boolean, expertise: boolean){
    this.playerService.applyProfOrExp(player, skill, proficiency, expertise);
    this.changes['disableButton'] = false;
  }

  filterExhaustion(player: Player): object{
   return this.playerService.filterExhaustion(player);
  }

  onCreateNewCharacter(stats: boolean){
    if (!stats){
      if (this.campaign.players.length < 10){
        this.newCharacter = <Player>{
          name: "",
          class: "",
          level: undefined
        };
        this.createNewCharacter = true;
        document.body.style.overflow = "hidden";
        document.body.style.height = "100%";

      } else {
        this.toastr.error("You may create up to a maximum of 10 players");
      }

    } else {
      this.newCharacter.name = this.playerService.title(this.newCharacter.name);
      this.newCharacter.proficiency = this.playerService.findClosestProficiency(this.newCharacter.level);
      this.playerService.generatePlayerStats(this.newCharacter);
      this.playerService.generateGeneralStats(this.newCharacter);
      this.playerService.generatePlayerSkills(this.newCharacter);
      this.playerService.generatePlayerSaves(this.newCharacter);
      this.playerService.generateAbilityScoreModifiers(this.newCharacter);
      this.playerService.generatePlayerConditions(this.newCharacter);
      this.campaign.players.push(this.newCharacter);
      this.createNewCharacter = false;

      this.changes['disableButton'] = false;
      this.playerService.unsavedCharacterChanges = true;
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
    }
  }

  onBeforeDeleteCharacter(player: Player, index: number){
    this.toDelete = {player: player, index: index, deletionConfirmation: ""};
    this.deleteCharacter = true;
    document.body.style.overflow = "hidden";
    document.body.style.height = "100%";
  }

  onDeletion(){
    this.campaign.players.splice(this.toDelete['index'], 1);
    this.deleteCharacter = false;
    this.changes['disableButton'] = false;
    this.playerService.unsavedCharacterChanges = true;
    document.body.style.overflow = "auto";
    document.body.style.height = "auto";
  }

  onCancelModal(state: string){
    if (state === 'characterCreation'){
      this.createNewCharacter = false;
    } else if(state === 'characterDeletion'){
      this.deleteCharacter = false;
    }
    document.body.style.overflow = "auto";
    document.body.style.height = "auto";
  }


}
