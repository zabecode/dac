<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import { ShieldAlert } from 'lucide-vue-next'
import { router } from '@inertiajs/vue3'

const goBack = () => {
    router.visit('/dashboard')
}
</script>

<template>
    <div class="min-h-screen bg-[#1c1c1c] flex items-center justify-center px-4">

        <Head title="Acesso Negado" />

        <div class="max-w-md w-full">
            <!-- Icon -->
            <div class="flex justify-center mb-6">
                <div
                    class="w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center">
                    <ShieldAlert class="w-10 h-10 text-red-400" />
                </div>
            </div>

            <!-- Content -->
            <div class="text-center space-y-4">
                <h1 class="text-4xl font-black text-white">
                    403
                </h1>
                <h2 class="text-xl font-bold text-zinc-300">
                    Acesso Negado
                </h2>
                <p class="text-sm text-zinc-400 leading-relaxed">
                    Você não tem permissão para acessar esta área.
                    <br />
                    Apenas administradores podem visualizar este conteúdo.
                </p>
            </div>

            <!-- Action -->
            <div class="mt-8 flex justify-center">
                <button @click="goBack"
                    class="px-6 py-3 bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-[#3b82f6]/20 hover:shadow-[#3b82f6]/30">
                    Voltar ao Dashboard
                </button>
            </div>

            <!-- Footer -->
            <div class="mt-12 text-center">
                <p class="text-xs text-zinc-600">
                    Se você acredita que isso é um erro, entre em contato com o administrador.
                </p>
            </div>
        </div>
    </div>
</template>
