import * as Validator from 'class-validator';
export class EditAdministratorDto{
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(6, 128)
    @Validator.Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/)
    password: string;
}