import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../shared/models/user.model';
import { of, delay, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    currentUser = signal<User | null>(null);

    constructor(private router: Router) {
        // Check localStorage for persisted user
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser.set(JSON.parse(savedUser));
        }
    }

    login(email: string, password: string) {
        // Mock login
        const mockUser: User = {
            id: 1,
            name: 'Demo Freelancer',
            email: email,
            token: 'mock-jwt-token-123'
        };

        return of(mockUser).pipe(
            delay(800), // Simulate network delay
            tap(user => {
                this.currentUser.set(user);
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.router.navigate(['/dashboard']);
            })
        );
    }

    logout() {
        this.currentUser.set(null);
        localStorage.removeItem('currentUser');
        this.router.navigate(['/auth/login']);
    }

    isLoggedIn() {
        return !!this.currentUser();
    }
}
