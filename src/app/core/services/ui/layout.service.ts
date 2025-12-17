import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LayoutService {
    isSidebarOpen = signal(false);
    isDark = signal(false);

    constructor() {
        this.initTheme();
    }

    initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
            this.setDark(true);
        } else {
            this.setDark(false);
        }
    }

    toggleSidebar() {
        this.isSidebarOpen.update(v => !v);
    }

    closeSidebar() {
        this.isSidebarOpen.set(false);
    }

    toggleTheme() {
        this.setDark(!this.isDark());
    }

    private setDark(isDark: boolean) {
        this.isDark.set(isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }
}
