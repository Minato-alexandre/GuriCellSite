import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/nova/',  // <--- ADICIONE ESTA LINHA (O nome deve ser igual ao da pasta que criaremos)
})