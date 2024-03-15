export class JwtDataDto {
    role: "administrator" | "user";
    id: number;
    identity: string;
    exp: number; 
    ip: string;
    ua: string;

    toPlainObject(){
        return {
            role: this.role,
            id: this.id,
            identity: this.identity,
            exp: this.exp,
            ip: this.ip,
            ua: this.ua
        }
    }
}
// kada se struktura tokena promeni kao u slucaju ext - exp onda ni jedan token koji smo imali u postman-u nece vise biti validan, moramo praviti novi!