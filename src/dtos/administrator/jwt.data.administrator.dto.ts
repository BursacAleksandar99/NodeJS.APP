export class JwtDataAdministratorDto {
    administratorId: number;
    username: string;
    exp: number; 
    ip: string;
    ua: string;

    toPlainObject(){
        return {
            administratorId: this.administratorId,
            username: this.username,
            exp: this.exp,
            ip: this.ip,
            ua: this.ua
        }
    }
}
// kada se struktura tokena promeni kao u slucaju ext - exp onda ni jedan token koji smo imali u postman-u nece vise biti validan, moramo praviti novi!