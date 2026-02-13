<script setup lang="ts">
import { ref, computed } from 'vue'
import AppLayout from '../../layouts/AppLayout.vue'
import { Head, usePage } from '@inertiajs/vue3'
import { BookOpen, Copy, ExternalLink, FileText, Code } from 'lucide-vue-next'
import { useToast } from 'primevue/usetoast'

interface DocFile {
    slug: string
    title: string
    order: number
    html: string
    content: string
}

const props = defineProps<{
    docs: DocFile[]
}>()

const toast = useToast()
const page = usePage()
const activeSlug = ref(props.docs[0]?.slug || '')

const activeDoc = computed(() => props.docs.find((d) => d.slug === activeSlug.value))
const viewMode = ref<'rendered' | 'raw'>('rendered')

const appUrl = computed(() => (page.props as any).app_url || 'https://seu-dominio.com')

const copyToClipboard = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text)
        toast.add({ severity: 'success', summary: 'Copiado', detail: 'Copiado para a área de transferência', life: 2000 })
    } catch {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao copiar', life: 3000 })
    }
}
</script>

<template>

    <Head title="Documentação" />

    <AppLayout>
        <template #header>
            <div class="flex flex-col gap-1">
                <h1 class="text-2xl font-bold text-zinc-900 dark:text-white">Documentação</h1>
                <p class="text-zinc-500 text-sm">Referência completa da API, autenticação e permissões.</p>
            </div>
        </template>

        <div class="flex gap-6">
            <!-- Sidebar -->
            <div class="w-56 shrink-0 hidden lg:block">
                <nav class="sticky top-6 space-y-1">
                    <p
                        class="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 mb-3 px-3">
                        Conteúdo
                    </p>
                    <button v-for="doc in docs" :key="doc.slug" @click="activeSlug = doc.slug"
                        class="w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all"
                        :class="activeSlug === doc.slug
                            ? 'bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20'
                            : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/5 border border-transparent'">
                        <div class="flex items-center gap-2">
                            <BookOpen class="w-3 h-3 shrink-0" />
                            {{ doc.title }}
                        </div>
                    </button>

                    <!-- Public API links -->
                    <div class="pt-6 mt-6 border-t border-zinc-200 dark:border-white/5">
                        <p
                            class="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 mb-3 px-3">
                            API Pública
                        </p>
                        <a :href="`${appUrl}/api/v1/docs`" target="_blank"
                            class="flex items-center gap-2 px-3 py-2 text-[10px] text-zinc-500 hover:text-[#3b82f6] transition-colors rounded-lg hover:bg-[#3b82f6]/5">
                            <Code class="w-3 h-3" />
                            Listar documentos
                            <ExternalLink class="w-2.5 h-2.5 ml-auto" />
                        </a>
                        <a v-if="activeDoc" :href="`${appUrl}/api/v1/docs/${activeDoc.slug}`" target="_blank"
                            class="flex items-center gap-2 px-3 py-2 text-[10px] text-zinc-500 hover:text-[#3b82f6] transition-colors rounded-lg hover:bg-[#3b82f6]/5">
                            <FileText class="w-3 h-3" />
                            Ver renderizado (HTML)
                            <ExternalLink class="w-2.5 h-2.5 ml-auto" />
                        </a>
                        <a v-if="activeDoc" :href="`${appUrl}/api/v1/docs/${activeDoc.slug}/raw`" target="_blank"
                            class="flex items-center gap-2 px-3 py-2 text-[10px] text-zinc-500 hover:text-[#3b82f6] transition-colors rounded-lg hover:bg-[#3b82f6]/5">
                            <Code class="w-3 h-3" />
                            Ver markdown bruto
                            <ExternalLink class="w-2.5 h-2.5 ml-auto" />
                        </a>
                    </div>
                </nav>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
                <!-- Mobile selector -->
                <div class="lg:hidden mb-6">
                    <select v-model="activeSlug"
                        class="w-full bg-zinc-50 dark:bg-[#1c1c1c] border border-zinc-200 dark:border-white/10 rounded-lg px-3 py-2 text-xs text-zinc-900 dark:text-white">
                        <option v-for="doc in docs" :key="doc.slug" :value="doc.slug">
                            {{ doc.title }}
                        </option>
                    </select>
                </div>

                <div v-if="activeDoc"
                    class="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl overflow-hidden">
                    <!-- Header -->
                    <div
                        class="flex items-center justify-between px-6 py-3 border-b border-zinc-200 dark:border-white/5">
                        <div class="flex items-center gap-3">
                            <div
                                class="w-7 h-7 rounded-md bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center">
                                <BookOpen class="w-3.5 h-3.5 text-[#3b82f6]" />
                            </div>
                            <h2 class="text-sm font-bold text-zinc-900 dark:text-white">{{ activeDoc.title }}</h2>
                        </div>
                        <div class="flex items-center gap-2">
                            <button @click="viewMode = 'rendered'"
                                class="px-2.5 py-1 text-[10px] rounded-md font-bold transition-all" :class="viewMode === 'rendered'
                                    ? 'bg-[#3b82f6] text-white'
                                    : 'text-zinc-400 hover:text-white hover:bg-white/5'">
                                <FileText class="w-3 h-3 inline mr-1" />
                                Visualizar
                            </button>
                            <button @click="viewMode = 'raw'"
                                class="px-2.5 py-1 text-[10px] rounded-md font-bold transition-all" :class="viewMode === 'raw'
                                    ? 'bg-[#3b82f6] text-white'
                                    : 'text-zinc-400 hover:text-white hover:bg-white/5'">
                                <Code class="w-3 h-3 inline mr-1" />
                                Markdown
                            </button>
                            <button @click="copyToClipboard(activeDoc.content)"
                                class="p-1.5 text-zinc-400 hover:text-[#3b82f6] hover:bg-[#3b82f6]/10 rounded-md transition-colors"
                                title="Copiar markdown">
                                <Copy class="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    <!-- Rendered view -->
                    <div v-if="viewMode === 'rendered'" class="px-8 py-6 prose-docs" v-html="activeDoc.html" />

                    <!-- Raw markdown view -->
                    <div v-else class="px-6 py-4">
                        <pre
                            class="text-[11px] text-zinc-400 font-mono leading-relaxed whitespace-pre-wrap break-words">{{
                                activeDoc.content }}</pre>
                    </div>
                </div>

                <!-- Empty state -->
                <div v-else
                    class="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl p-12 text-center">
                    <BookOpen class="w-8 h-8 mx-auto text-zinc-400 dark:text-zinc-600 mb-3" />
                    <p class="text-sm text-zinc-500">Nenhum documento disponível.</p>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<style>
/* Prose styles for rendered markdown */
.prose-docs {
    font-size: 0.875rem;
    line-height: 1.625;
    color: #3f3f46;
}

:is(.dark .prose-docs) {
    color: #d4d4d8;
}

.prose-docs h1 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #18181b;
    margin-top: 0;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e4e4e7;
}

:is(.dark .prose-docs h1) {
    color: #fff;
    border-bottom-color: rgba(255, 255, 255, 0.1);
}

.prose-docs h2 {
    font-size: 1rem;
    font-weight: 700;
    color: #18181b;
    margin-top: 2rem;
    margin-bottom: 0.75rem;
}

:is(.dark .prose-docs h2) {
    color: #fff;
}

.prose-docs h3 {
    font-size: 0.875rem;
    font-weight: 700;
    color: #27272a;
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
}

:is(.dark .prose-docs h3) {
    color: #e4e4e7;
}

.prose-docs p {
    margin-bottom: 1rem;
}

.prose-docs ul,
.prose-docs ol {
    margin-bottom: 1rem;
    padding-left: 1.25rem;
}

.prose-docs ul {
    list-style-type: disc;
}

.prose-docs ol {
    list-style-type: decimal;
}

.prose-docs li {
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
}

.prose-docs code {
    font-size: 11px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    background: #f4f4f5;
    color: #3b82f6;
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
}

:is(.dark .prose-docs code) {
    background: rgba(0, 0, 0, 0.4);
}

.prose-docs pre {
    background: #09090b;
    border: 1px solid #e4e4e7;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 1rem;
    overflow-x: auto;
}

:is(.dark .prose-docs pre) {
    background: rgba(0, 0, 0, 0.6);
    border-color: rgba(255, 255, 255, 0.1);
}

.prose-docs pre code {
    background: transparent;
    color: #86efac;
    padding: 0;
    font-size: 11px;
}

.prose-docs table {
    width: 100%;
    margin-bottom: 1rem;
    border-collapse: collapse;
    font-size: 0.75rem;
}

.prose-docs th {
    text-align: left;
    padding: 0.5rem 0.75rem;
    background: #f4f4f5;
    border: 1px solid #e4e4e7;
    font-weight: 700;
    color: #3f3f46;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

:is(.dark .prose-docs th) {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
    color: #d4d4d8;
}

.prose-docs td {
    padding: 0.5rem 0.75rem;
    border: 1px solid #e4e4e7;
    color: #52525b;
}

:is(.dark .prose-docs td) {
    border-color: rgba(255, 255, 255, 0.1);
    color: #a1a1aa;
}

.prose-docs blockquote {
    border-left: 2px solid rgba(59, 130, 246, 0.3);
    padding-left: 1rem;
    margin-left: 0;
    font-style: italic;
    color: #71717a;
    margin-bottom: 1rem;
}

:is(.dark .prose-docs blockquote) {
    color: #a1a1aa;
}

.prose-docs strong {
    color: #18181b;
}

:is(.dark .prose-docs strong) {
    color: #fff;
}

.prose-docs a {
    color: #3b82f6;
    text-decoration: underline;
}

.prose-docs a:hover {
    opacity: 0.8;
}

.prose-docs hr {
    border-color: #e4e4e7;
    margin: 1.5rem 0;
}

:is(.dark .prose-docs hr) {
    border-color: rgba(255, 255, 255, 0.1);
}
</style>
