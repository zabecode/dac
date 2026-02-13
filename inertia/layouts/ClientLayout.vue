<script setup lang="ts">
import { LayoutDashboard, BookOpen, User as UserIcon } from 'lucide-vue-next'
import Sidebar from '../components/Sidebar.vue'
import Topbar from '../components/Topbar.vue'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Ajuda & Docs', href: '/docs', icon: BookOpen },
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
                    class="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-primary/5 dark:bg-primary/10 blur-[120px] opacity-20">
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
