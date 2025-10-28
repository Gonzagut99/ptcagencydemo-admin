// import { goto } from '$app/navigation';

interface User {
	id: number;
	userName: string;
	email: string;
}

interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
}

class AuthStore {
	private state = $state<AuthState>({
		user: null,
		token: null,
		isAuthenticated: false
	});

	get user() {
		return this.state.user;
	}

	get token() {
		return this.state.token;
	}

	get isAuthenticated() {
		return this.state.isAuthenticated;
	}

	login(user: User, token: string) {
		this.state.user = user;
		this.state.token = token;
		this.state.isAuthenticated = true;
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('auth_token', token);
			localStorage.setItem('user', JSON.stringify(user));
		}
	}

	logout() {
		this.state.user = null;
		this.state.token = null;
		this.state.isAuthenticated = false;
		if (typeof localStorage !== 'undefined') {
			localStorage.removeItem('auth_token');
			localStorage.removeItem('user');
		}
		if (typeof window !== 'undefined') {
			window.location.href = '/login';
		}
	}

	initialize() {
		if (typeof localStorage !== 'undefined') {
			const token = localStorage.getItem('auth_token');
			const userStr = localStorage.getItem('user');
			if (token && userStr) {
				this.state.token = token;
				this.state.user = JSON.parse(userStr);
				this.state.isAuthenticated = true;
			}
		}
	}
}

export const authStore = new AuthStore();
