export class UserModel {
  constructor(
    public name?: string,
    public username?: string,
    public e_mail?: string,
    public picture_url: string = 'https://proyecto2-39-semi1.s3.us-east-2.amazonaws.com/',
    public profile_picture?: string,
    public password?: string,
    public posts?: number,
    public friends?: number,
    public bot_mode?: boolean
  ) {}
}
