import { Injectable, OnInit } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ConversationService implements OnInit{
    conversations: {name: string, time: string, latestMassege: string, id: number}[] = [
        {name: "Margaaaaaa", time:"8:21", latestMassege: "Momito sei troppo figo", id: 0},
        {name: "MargaMonte", time:"8:21", latestMassege: "Momito sei troppo figo", id: 1},
        {name: "MargaMonte", time:"8:21", latestMassege: "Momito sei troppo figo", id: 2},
        {name: "MargaMonte", time:"8:21", latestMassege: "Momito sei troppo figo", id: 3},
        {name: "MargaMonte", time:"8:21", latestMassege: "Momito sei troppo figo", id: 4},
        {name: "MargaMonte", time:"8:21", latestMassege: "Momito sei troppo figo", id: 5},
        {name: "MargaMonte", time:"8:21", latestMassege: "Momito sei troppo figo", id: 6},
        {name: "MargaMonte", time:"8:21", latestMassege: "Momito sei troppo figo", id: 7},
        {name: "MargaMonte", time:"8:21", latestMassege: "Momito sei troppo figo", id: 8},
        {name: "MargaMonte", time:"8:21", latestMassege: "Momito sei troppo figo", id: 9},
        {name: "MargaMonte", time:"8:21", latestMassege: "Momito sei troppo figo", id: 10},
        {name: "MargaMonte", time:"8:21", latestMassege: "Momito sei troppo figo", id: 11},
        {name: "MargaMonte", time:"8:21", latestMassege: "Momito sei troppo figo", id: 12},
        {name: "MargaMonte", time:"8:21", latestMassege: "Momito sei troppo figo", id: 13}
    ];


    constructor(){}


    ngOnInit(){

    }

}