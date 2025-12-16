import { useState } from 'react'
import { supabase } from '../supabase' // Certifique-se que o caminho/nome está certo
import { useNavigate } from 'react-router-dom'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState(null)

    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault() // Evita recarregar a página
        setLoading(true)
        setErrorMsg(null)

        try {
            // O Supabase verifica as credenciais e cria a sessão segura
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            })

            if (error) {
                // Se errou a senha ou email
                setErrorMsg('E-mail ou senha incorretos.')
                console.error('Erro de login:', error.message)
            } else {
                // Sucesso! O Supabase já salvou o token no LocalStorage automaticamente.
                console.log('Login realizado:', data)
                navigate('/admin') // Mude para a rota do seu painel
            }
        } catch (err) {
            setErrorMsg('Ocorreu um erro inesperado.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md">

                <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
                    Painel GuriCell
                </h2>

                <form onSubmit={handleLogin} className="space-y-4">

                    {/* Campo de E-mail */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">E-mail</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded border border-gray-300 p-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                            placeholder="e-mail"
                        />
                    </div>

                    {/* Campo de Senha */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Senha</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded border border-gray-300 p-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Mensagem de Erro */}
                    {errorMsg && (
                        <div className="rounded bg-red-50 p-2 text-center text-sm text-red-600">
                            {errorMsg}
                        </div>
                    )}

                    {/* Botão de Entrar */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full rounded py-2 font-bold text-white transition duration-200 
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        {loading ? 'Entrando...' : 'Acessar Sistema'}
                    </button>
                </form>

            </div>
        </div>
    )
}