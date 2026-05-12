export type NavItem = {
    title:string,
    link:string
}

export interface LoginData {
    email:string,
    password:string,
}

export interface SignUpData extends LoginData{
    full_name:string,
    phone:string,
    address:string,
    account_type:string
}