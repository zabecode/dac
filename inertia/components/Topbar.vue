<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { usePage, Link } from '@inertiajs/vue3'
import { Bell, CircleHelp, Slash, LogOut, Sun, Moon } from 'lucide-vue-next'

const page = usePage()
const user = computed(() => (page.props.auth as any)?.user)

// --- Theme Management ---
const isDark = ref(true)

const toggleTheme = () => {
    isDark.value = !isDark.value
    applyTheme()
}

const applyTheme = () => {
    if (isDark.value) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
    } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
    }
}

onMounted(() => {
    // Theme Init
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'light') {
        isDark.value = false
        document.documentElement.classList.remove('dark')
    } else {
        isDark.value = true
        document.documentElement.classList.add('dark')
    }
})

const breadcrumbs = computed(() => {
    const path = page.url.split('?')[0]
    const parts = path.split('/').filter(p => p)

    const crumbs = [{ label: 'Dashboard', href: '/dashboard', active: false }]

    if (path.startsWith('/settings/')) {
        const settingsPage = parts[parts.length - 1]
        const label = settingsPage.split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        crumbs.push({ label, href: path, active: true })
        return crumbs
    }

    let currentPath = ''
    parts.forEach((part, index) => {
        currentPath += `/${part}`
        const label = part.split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        crumbs.push({
            label,
            href: currentPath,
            active: index === parts.length - 1
        })
    })

    return crumbs
})
</script>

<template>
    <header data-version="v3-fix-sidebar"
        class="h-14 border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-6 bg-white/80 dark:bg-[#1c1c1c]/80 backdrop-blur-md sticky top-0 z-10 w-full transition-all duration-300">

        <!-- Left Side: Breadcrumbs -->
        <div class="flex items-center gap-4 text-sm text-slate-500 dark:text-zinc-400 overflow-hidden">
            <!-- Project Name -->
            <span
                class="text-[10px] font-black uppercase tracking-widest text-[#3b82f6] hidden md:block select-none cursor-default">
                SaaS
            </span>

            <div class="hidden lg:flex items-center gap-2">
                <template v-for="crumb in breadcrumbs" :key="crumb.href">
                    <Slash class="w-3 h-3 text-zinc-700 dark:text-zinc-600 -rotate-12 shrink-0" />
                    <span class="text-[11px] font-medium whitespace-nowrap select-none cursor-default"
                        :class="crumb.active ? 'text-slate-900 dark:text-zinc-100' : 'text-slate-500 dark:text-zinc-500'">
                        {{ crumb.label }}
                    </span>
                </template>
            </div>
        </div>

        <!-- Right Side: Actions -->
        <div class="flex items-center gap-3 shrink-0">
            <!-- Theme Switcher -->
            <button @click="toggleTheme"
                class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-500 hover:text-slate-900 dark:hover:text-zinc-200"
                :title="isDark ? 'Modo Claro' : 'Modo Escuro'">
                <Sun v-if="isDark" class="w-4 h-4" />
                <Moon v-else class="w-4 h-4" />
            </button>

            <div class="h-4 w-[1px] bg-slate-200 dark:bg-white/10 mx-1 hidden md:block"></div>

            <a href="/docs" class="text-slate-500 hover:text-[#3b82f6] transition-colors p-1" title="Documentação">
                <CircleHelp class="w-4 h-4" />
            </a>

            <button class="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors relative p-1">
                <Bell class="w-4 h-4" />
                <span
                    class="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white dark:border-[#1c1c1c]"></span>
            </button>

            <div class="h-4 w-[1px] bg-slate-200 dark:bg-white/10 mx-1"></div>

            <!-- Logout -->
            <Link href="/logout" method="post" as="button"
                class="text-slate-500 hover:text-red-400 transition-colors p-1" title="Sair">
                <LogOut class="w-4 h-4" />
            </Link>

            <!-- User Avatar -->
            <Link href="/settings/profile"
                class="w-7 h-7 rounded-full bg-gradient-to-tr from-[#3b82f6] to-blue-600 p-[1px] shadow-lg shadow-[#3b82f6]/20 cursor-pointer group block">
                <div
                    class="w-full h-full rounded-full bg-white dark:bg-[#1c1c1c] flex items-center justify-center group-hover:bg-zinc-50 dark:group-hover:bg-[#1c1c1c]/80 transition-colors">
                    <span class="text-[10px] font-bold text-[#3b82f6]">
                        {{ user?.fullName?.charAt(0).toUpperCase() || 'U' }}
                    </span>
                </div>
            </Link>
        </div>
    </header>
</template>
