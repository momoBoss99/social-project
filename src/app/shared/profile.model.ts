export class Profile {
    constructor(public id: number,
                public nome: string,
                public nickname: string,
                public followers: number,
                public following: number,
                public biografia: string,
                public proPic: string,
                public email: string){}
}