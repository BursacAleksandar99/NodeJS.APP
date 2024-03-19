import { SetMetadata } from "@nestjs/common"

// export const AllowToRoles = (...roles: ("administrator" | "user")[]) => {
    
//     return SetMetadata('allow_to_roles', roles);
// };
export const AllowToRoles = (...roles: ("administrator" | "user")[]) => {
    roles.forEach(role => {
        if (role !== "administrator" && role !== "user") {
            throw new Error(`Invalid role: ${role}. Only 'administrator' or 'user' roles are allowed.`);
        }
    });
    return SetMetadata('allow_to_roles', roles);
};
