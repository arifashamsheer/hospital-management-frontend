export interface Authresponse {
    token:string;

  user:{
    id:string;
    name:string;
    email:string;
    role:string;
  }
}
