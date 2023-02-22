import { Injectable } from '@angular/core';
import { Player } from '../interfaces/player';

@Injectable({
  providedIn: 'root'
})
export class CampaignLoaderService {
  campaignData: object;
  campaignName: string;
  players: Player[] = [];

  constructor() { }

  /**
   * 
   * @param campaignData All data received from the server after the user has entered their campaign code
   */
  loadCampaign(campaignData: object, campaignCode: string){
    this.campaignData = campaignData[campaignCode];
    this.campaignName = campaignData[campaignCode]['name'];
    
    this.campaignData['players'].forEach((player: string) => {
      this.players.push(
        <Player>{
          name:         player['name'],
          strength:     player['strength'] ? player['strength'] : "",
          dexterity:    player['dexterity'] ? player['dexterity'] : "",
          constitution: player['constitution'] ? player['constitution'] : "",
          intelligence: player['intelligence'] ? player['intelligence'] : "",
          wisdom:       player['wisdom'] ? player['wisdom'] : "",
          charisma:     player['charisma'] ? player['charisma'] : ""
        }
      );
    });
  }

  /**
   * 
   * @returns All loaded campaign data.
   */
  getCampaignData(){
    return {
      campaignName: this.campaignName,
      players: this.players
    };
  }

}