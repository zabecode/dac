<script setup lang="ts">
import { LayoutDashboard, Key, Users, BookOpen, User as UserIcon, Cpu, Activity } from 'lucide-vue-next'
import Sidebar from '../components/Sidebar.vue'
import Topbar from '../components/Topbar.vue'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Dispositivos', href: '/devices', icon: Cpu },
    { name: 'Sensores', href: '/sensors', icon: Activity },
    { name: 'API Keys', href: '/api-keys', icon: Key },
    { name: 'Usuários', href: '/users', icon: Users },
    { name: 'Documentação', href: '/docs', icon: BookOpen },
    { name: 'Meu Perfil', href: '/settings/profile', icon: UserIcon },
]
</script>

<template>
    <div class="min-h-screen bg-background text-text font-sans flex transition-colors duration-300">
        <Sidebar :navigation="navigation" />

        <main class="flex-1 ml-14 transition-[margin] duration-300 ease-in-out relative min-h-screen bg-background">
            <!-- Background Glow -->
            <div class="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden">
                <div
                    class="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-accent/10 dark:bg-accent/20 blur-[120px] opacity-30">
                </div>
                <div
                    class="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-[100px] opacity-20">
                </div>
            </div>

            <Topbar />
            <div class="max-w-7xl mx-auto px-6 py-8">
                <header class="mb-6" v-if="$slots.header">
                    <slot name="header" />
                </header>
                <slot />
            </div>
        </main>
        <Toast />
        <ConfirmDialog />
    </div>
</template>
