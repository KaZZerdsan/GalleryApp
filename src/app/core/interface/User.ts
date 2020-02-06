
export interface Client {
    id:                number;
    name:              string;
    randomId:          string;
    secret:            string;
    allowedGrantTypes: string[];
}

export interface SignUpUser {
    email:    string;
    phone:    string;
    fullName: string;
    password: string;
    username: string;
    roles:    [string];
}

export interface User{
    password: string;
    username: string;
}