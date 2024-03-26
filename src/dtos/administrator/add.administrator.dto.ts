import * as Validator from 'class-validator';
export class AddAdministratorDto {
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Matches(/^[a-z][a-z0-9\.]{3,30}[a-z0-9]$/)
    username: string;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(6, 128)
    @Validator.Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/)
    password: string;
}