
class AuthService {
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));;
    }

    getToken(){
        return localStorage.getItem('token');
    }

    logout(){
        localStorage.removeItem('user')
        localStorage.removeItem('token')
    }
}

export default new AuthService();
