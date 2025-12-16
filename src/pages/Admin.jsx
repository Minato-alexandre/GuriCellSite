import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { Trash2, Edit, Plus, LogOut, X, Lock, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Modais
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    // Estados de Edição
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: "", price: "", brand: "", description: "",
        image: "", category: "celular", productType: "novo", badge: ""
    });

    // Estado de Senha
    const [newPassword, setNewPassword] = useState("");
    const [loadingPass, setLoadingPass] = useState(false);

    useEffect(() => {
        checkAuthAndFetch();
    }, []);

    async function checkAuthAndFetch() {
        // 1. Verifica se está logado
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            navigate("/login");
            return;
        }

        // 2. Busca produtos
        fetchProducts();
    }

    async function fetchProducts() {
        setLoading(true);
        // Busca ordenando pelo ID mais recente primeiro (descendente)
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('id', { ascending: false });

        if (error) console.error("Erro ao buscar:", error);
        else setProducts(data || []);

        setLoading(false);
    }

    // --- FUNÇÕES DE PRODUTO ---
    async function handleSaveProduct(e) {
        e.preventDefault();
        try {
            if (editingProduct) {
                // Atualizar existente
                const { error } = await supabase
                    .from('products')
                    .update(formData)
                    .eq('id', editingProduct.id);
                if (error) throw error;
            } else {
                // Criar novo
                const { error } = await supabase
                    .from('products')
                    .insert([formData]);
                if (error) throw error;
            }

            setIsProductModalOpen(false);
            setEditingProduct(null);
            resetForm();
            fetchProducts(); // Recarrega a lista
            alert("Produto salvo com sucesso!");
        } catch (error) {
            alert("Erro ao salvar: " + error.message);
        }
    }

    async function handleDelete(id) {
        if (confirm("Tem certeza que deseja excluir este produto?")) {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) alert("Erro ao excluir: " + error.message);
            else fetchProducts();
        }
    }

    function openEdit(product) {
        setEditingProduct(product);
        setFormData(product);
        setIsProductModalOpen(true);
    }

    function openNew() {
        setEditingProduct(null);
        resetForm();
        setIsProductModalOpen(true);
    }

    function resetForm() {
        setFormData({
            name: "", price: "", brand: "Apple", description: "",
            image: "", category: "celular", productType: "novo", badge: "Em Estoque"
        });
    }

    // --- FUNÇÕES DE SENHA E LOGOUT ---
    async function handleChangePassword(e) {
        e.preventDefault();
        setLoadingPass(true);

        const { error } = await supabase.auth.updateUser({ password: newPassword });

        if (error) {
            alert("Erro ao mudar senha: " + error.message);
        } else {
            alert("Senha alterada com sucesso!");
            setIsPasswordModalOpen(false);
            setNewPassword("");
        }
        setLoadingPass(false);
    }

    async function handleLogout() {
        await supabase.auth.signOut();
        navigate("/login");
    }

    return (
        <div className="min-h-screen bg-gray-100 font-sans text-gray-800">

            {/* BARRA SUPERIOR */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Painel GuriCell</h1>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsPasswordModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition"
                        >
                            <Lock size={18} /> Alterar Senha
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                            <LogOut size={18} /> Sair
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-4 md:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-700">Produtos Cadastrados ({products.length})</h2>
                    <button onClick={openNew} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-bold shadow-lg transition transform hover:-translate-y-0.5">
                        <Plus size={20} /> Novo Produto
                    </button>
                </div>

                {/* LISTA DE PRODUTOS */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider font-bold">
                                <tr>
                                    <th className="p-4 border-b">Imagem</th>
                                    <th className="p-4 border-b">Nome / Marca</th>
                                    <th className="p-4 border-b">Preço</th>
                                    <th className="p-4 border-b">Aba (Site)</th>
                                    <th className="p-4 border-b text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan="5" className="p-8 text-center text-gray-500">Carregando estoque...</td></tr>
                                ) : products.length === 0 ? (
                                    <tr><td colSpan="5" className="p-8 text-center text-gray-500">Nenhum produto cadastrado.</td></tr>
                                ) : (
                                    products.map((p) => (
                                        <tr key={p.id} className="hover:bg-yellow-50/50 transition-colors group">
                                            <td className="p-4">
                                                <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden">
                                                    <img src={p.image || "https://placehold.co/100"} className="w-full h-full object-cover" alt="" onError={(e) => e.target.src = 'https://placehold.co/100?text=Erro'} />
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <p className="font-bold text-gray-900">{p.name}</p>
                                                <span className="text-xs text-gray-500">{p.brand}</span>
                                            </td>
                                            <td className="p-4 font-medium text-gray-900">{p.price}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${p.productType === 'novo' ? 'bg-green-100 text-green-700' :
                                                        p.productType === 'seminovo' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                                    }`}>
                                                    {p.productType}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button onClick={() => openEdit(p)} className="text-blue-600 hover:bg-blue-100 p-2 rounded mr-1" title="Editar"><Edit size={18} /></button>
                                                <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:bg-red-100 p-2 rounded" title="Excluir"><Trash2 size={18} /></button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* --- MODAL DE PRODUTO --- */}
            {isProductModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
                        <button onClick={() => setIsProductModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black transition"><X size={24} /></button>
                        <h2 className="text-2xl font-bold mb-6 text-gray-900">{editingProduct ? 'Editar Produto' : 'Cadastrar Novo'}</h2>

                        <form onSubmit={handleSaveProduct} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Nome do Produto</label>
                                    <input required type="text" className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition"
                                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Ex: iPhone 13" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Preço</label>
                                    <input required type="text" className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                                        value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} placeholder="Ex: R$ 3.500" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Marca</label>
                                    <select className="w-full border border-gray-300 p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-yellow-500 outline-none"
                                        value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })}>
                                        {['Apple', 'Samsung', 'Xiaomi', 'Motorola', 'Outros'].map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Categoria (Aba do Site)</label>
                                    <select className="w-full border border-gray-300 p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-yellow-500 outline-none"
                                        value={formData.productType} onChange={e => setFormData({ ...formData, productType: e.target.value })}>
                                        <option value="novo">Novo (Lacrado)</option>
                                        <option value="seminovo">Seminovo (Usado)</option>
                                        <option value="acessorio">Acessório</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Link da Foto (URL)</label>
                                <div className="flex gap-2">
                                    <input type="text" className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                                        value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." />
                                    {formData.image && <img src={formData.image} className="w-10 h-10 rounded object-cover border" alt="Preview" />}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Copie o link da imagem do Google ou Imgur.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Etiqueta (Badge)</label>
                                    <input type="text" className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                                        value={formData.badge} onChange={e => setFormData({ ...formData, badge: e.target.value })} placeholder="Ex: Oferta, Novo..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Categoria Técnica</label>
                                    <select className="w-full border border-gray-300 p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-yellow-500 outline-none"
                                        value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                        <option value="celular">Celular</option>
                                        <option value="acessorio">Outros</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Descrição Detalhada</label>
                                <textarea className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none" rows="3"
                                    value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="GB, Estado da bateria, Garantia..."></textarea>
                            </div>

                            <div className="pt-2">
                                <button type="submit" className="w-full bg-black text-white py-3.5 rounded-lg font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2">
                                    <Save size={20} /> SALVAR PRODUTO
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL DE MUDAR SENHA --- */}
            {isPasswordModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <button onClick={() => setIsPasswordModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black transition"><X size={24} /></button>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Lock size={20} /> Alterar Senha</h2>
                        <p className="text-sm text-gray-500 mb-4">Digite sua nova senha abaixo.</p>

                        <form onSubmit={handleChangePassword}>
                            <input
                                type="password"
                                placeholder="Nova senha"
                                className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:ring-2 focus:ring-yellow-500 outline-none"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                            <button disabled={loadingPass} className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition">
                                {loadingPass ? "Salvando..." : "Confirmar Nova Senha"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}