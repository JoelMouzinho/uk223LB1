export class User {
    static findById(userId: any) {
        throw new Error("Method not implemented.");
    }
    constructor(
        public userID: number | null,
        public name: string,
        public email: string,
        public password: string,
        public role: 'admin' | 'user' | 'moderator'
    ) {}
}