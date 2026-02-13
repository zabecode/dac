<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3'
import { } from 'vue'
import Icon from '../images/icon.png'

interface NavigationItem {
    name: string
    href: string
    icon: any
}

const props = defineProps<{
    navigation: NavigationItem[]
}>()

const page = usePage()

const isActiveRoute = (href: string) => {
    const currentPath = page.url.split('?')[0]
    if (currentPath === href) return true
    if (href !== '/' && currentPath.startsWith(href)) return true
    return false
}
</script>

<template>
    <aside
        class="fixed h-full z-20 flex flex-col bg-surface dark:bg-[#1c1c1c] border-r border-slate-200 dark:border-white/5 transition-all duration-300 ease-in-out w-14 hover:w-64 group overflow-hidden shadow-xl dark:shadow-2xl">

        <!-- Logo Area -->
        <div
            class="h-16 flex items-center px-3.5 border-b border-slate-200 dark:border-white/5 bg-surface dark:bg-black/20">
            <div class="flex items-center gap-3">
                <div
                    class="w-7 h-7 rounded-md bg-transparent flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform duration-500">
                    <img :src="Icon" alt="ZA" class="w-full h-full object-contain" />
                </div>
                <span
                    class="font-bold text-sm tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap uppercase">
                    Zabe Analytic
                </span>
            </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-2.5 py-6 space-y-1">
            <Link v-for="item in navigation" :key="item.name" :href="item.href"
                class="flex items-center gap-4 px-2 py-2.5 rounded-md transition-all duration-150 group/item relative overflow-hidden"
                :class="isActiveRoute(item.href) 
                    ? 'bg-primary/10 text-primary dark:bg-primary/10 dark:text-primary' 
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/5'">

                <div v-if="isActiveRoute(item.href)"
                    class="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-primary rounded-r-full"></div>

                <component :is="item.icon" class="w-4 h-4 shrink-0 transition-transform duration-200"
                    :class="isActiveRoute(item.href) ? 'text-primary' : ''" />

                <span
                    class="text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap absolute left-12 uppercase tracking-wider">
                    {{ item.name }}
                </span>
            </Link>
        </nav>

    </aside>
</template>
