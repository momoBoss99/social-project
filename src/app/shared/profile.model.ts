export class Profile {
    /*constructor(public id: string,
                public nome: string,
                public nickname: string,
                public followers: number,
                public following: number,
                public biografia: string,
                public proPic: string,
                public email: string){}
        */
    constructor(public id: string,
                public nome: string,
                public nickname: string,
                public biografia: string,
                public proPic: string,
                public email: string,
                public password?: string){}
}