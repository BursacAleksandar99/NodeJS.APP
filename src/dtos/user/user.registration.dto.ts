import * as Validator from 'class-validator';
export class UserRegistrationDto {

    @Validator.IsNotEmpty()
    @Validator.IsEmail({
    allow_ip_domain: false,
    allow_utf8_local_part: true,
    require_tld: true //domen!
  })
    email: string;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(6, 128)
    @Validator.Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,{
        message: 'Password must have at least one uppercase and one number!'
    })
    password: string;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(2, 64)
    forname: string;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(2, 64)
    surname: string;

    @Validator.IsNotEmpty()
    @Validator.IsPhoneNumber(null)
    phoneNumber: string;
    
}