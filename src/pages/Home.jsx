import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";

// --- Ícones ---
import {
    Smartphone, Wrench, Shield, Star, Phone, MapPin, Clock,
    CheckCircle, ArrowRight, Menu, X, Sun, Moon, MessageCircle
} from "lucide-react";

// --- Animações ---
import { motion, AnimatePresence } from "framer-motion";

// --- COMPONENTE DO CARD DE PRODUTO (Versão Compacta Vertical) ---
const ProductCardVertical = ({ product }) => {
    const handleZap = () => {
        const text = `Olá! Vi o ${product.name} no site por ${product.price} e tenho interesse.`;
        const phone = "5567998469393"; // SEU NÚMERO
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className="group bg-white dark:bg-[#121212] rounded-xl border border-gray-100 dark:border-gray-800 hover:border-black dark:hover:border-yellow-500 p-3 transition-all duration-300 flex gap-3 items-center shadow-sm hover:shadow-md">
            {/* Imagem Pequena */}
            <div className="relative w-20 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                <img
                    src={product.image || "https://placehold.co/400"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => e.target.src = 'https://placehold.co/150?text=Sem+Foto'}
                />
                {product.badge && (
                    <span className="absolute top-1 left-1 bg-black dark:bg-yellow-500 text-white dark:text-black text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide shadow-sm z-10">
                        {product.badge}
                    </span>
                )}
            </div>

            {/* Info */}
            <div className="flex-grow min-w-0">
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase mb-0.5">{product.brand}</p>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1 leading-tight truncate">{product.name}</h3>
                <div className="flex items-center justify-between">
                    <span className="text-gray-900 dark:text-white font-bold text-base">{product.price}</span>
                    <button
                        onClick={handleZap}
                        className="bg-gray-100 dark:bg-gray-800 hover:bg-green-600 hover:text-white dark:hover:bg-green-500 dark:hover:text-black p-2 rounded-lg transition-all"
                        title="Comprar no WhatsApp"
                    >
                        <MessageCircle className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENTE DA COLUNA DE CATEGORIA ---
const ProductColumn = ({ title, subtitle, items, hasSeparator }) => {
    if (!items || items.length === 0) return null;

    return (
        <div className={`flex-1 flex flex-col ${hasSeparator ? 'md:border-r border-gray-200 dark:border-gray-800 md:pr-6' : ''}`}>
            {/* Cabeçalho da Coluna */}
            <div className="mb-4 px-2 text-center md:text-left">
                <span className="text-yellow-600 dark:text-yellow-500 font-bold tracking-wider uppercase text-xs">{subtitle}</span>
                <h2 className="text-xl font-extrabold mt-0.5 text-gray-900 dark:text-white">{title}</h2>
            </div>

            {/* AQUI É ONDE O SCROLL ACONTECE */}
            <div className="flex flex-col gap-4 px-2 overflow-y-auto max-h-[500px] 
                pr-2 /* Espaço para o conteúdo não colar na barra */
                scrollbar-thin 
                scrollbar-track-transparent 
                scrollbar-thumb-gray-300 
                hover:scrollbar-thumb-yellow-500 
                dark:scrollbar-thumb-gray-800 
                dark:hover:scrollbar-thumb-yellow-500"
            >
                {items.map((product) => (
                    <ProductCardVertical key={product.id} product={product} />
                ))}
            </div>

            {/* Rodapé da Coluna (Link Ver Todos) */}
            <div className="text-center mt-4 md:text-left px-2">
                <a href="https://wa.me/5567998469393" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-gray-900 dark:text-white font-bold hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors">
                    Ver todos <ArrowRight className="w-3 h-3" />
                </a>
            </div>
        </div>
    );
};

// --- PÁGINA PRINCIPAL ---
export default function Home() {
    const [scrollY, setScrollY] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // --- SUPABASE ---
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('id', { ascending: false })
            .limit(15); // Limitando para não ficar uma lista gigante

        if (!error) setProducts(data || []);
    }

    const novos = products.filter(p => p.productType === 'novo');
    const seminovos = products.filter(p => p.productType === 'seminovo');
    const acessorios = products.filter(p => p.productType === 'acessorio');

    // --- TEMA E SCROLL ---
    const [theme, setTheme] = useState(() => {
        if (typeof window !== "undefined") return localStorage.getItem("theme") || "dark";
        return "dark";
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === "dark") root.classList.add("dark");
        else root.classList.remove("dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

    // --- DADOS FIXOS ---
    const whatsappLink = "https://wa.me/5567998469393";
    const whatsappDisplay = "(67) 9.9846-9393";
    const addressDisplay = "R. Joaquim Teixeira Alves, 1973";
    const addressCity = "Centro, Dourados - MS";

    const services = [
        {
            icon: Smartphone,
            title: "Venda de Aparelhos",
            description: "Novos e seminovos revisados com garantia de loja. Iphones, Xiaomi e Samsung.",
            features: ["Aceitamos seu usado", "Parcelamento no cartão", "Garantia GuriCell"],
        },
        {
            icon: Wrench,
            title: "Assistência Técnica",
            description: "Seu celular quebrou? A gente resolve. Troca de tela, bateria e reparos em placas.",
            features: ["Técnicos Especializados", "Peças de Qualidade", "Orçamento na Hora"],
        },
        {
            icon: Shield,
            title: "Acessórios Premium",
            description: "Proteja seu investimento com películas, capas anti-impacto e carregadores originais.",
            features: ["Películas 3D/Cerâmica", "Cabos Reforçados", "Fones Bluetooth"],
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] font-sans text-gray-900 dark:text-gray-100 overflow-x-hidden transition-colors duration-300 selection:bg-yellow-500 selection:text-black">

            {/* PADRÃO DE FUNDO (GRID) */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
                style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            {/* HEADER */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrollY > 20 || isMenuOpen
                    ? "bg-white/90 dark:bg-black/90 backdrop-blur-md border-gray-200 dark:border-gray-800 shadow-sm"
                    : "bg-transparent border-transparent"
                    }`}
            >
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex flex-col items-center group/logo cursor-pointer">
                            <div className="border-[3px] border-gray-900 dark:border-yellow-400 rounded-lg px-2 py-1 transition-colors duration-300 hover:scale-110 transform">
                                <span className="font-black text-2xl md:text-3xl tracking-tighter uppercase flex gap-1 leading-none">
                                    <span className="text-gray-900 dark:text-white transition-colors duration-300">GURI</span>
                                    <span className="text-yellow-400">CELL</span>
                                </span>
                            </div>
                        </div>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-8">
                            {['Serviços', 'Produtos', 'Contato'].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")}`}
                                    className="text-sm font-bold uppercase tracking-wide text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                                >
                                    {item}
                                </a>
                            ))}

                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-black dark:bg-yellow-500 hover:bg-gray-800 dark:hover:bg-yellow-400 text-white dark:text-black px-6 py-2.5 rounded-lg flex items-center font-bold transition shadow-lg transform hover:-translate-y-0.5"
                            >
                                <Phone className="w-4 h-4 mr-2" />
                                WhatsApp
                            </a>

                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-yellow-500 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                            >
                                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                            </button>
                        </nav>

                        {/* Mobile Toggle */}
                        <div className="flex items-center gap-3 md:hidden">
                            <button onClick={toggleTheme} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-yellow-500">
                                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                            </button>
                            <button className="text-black dark:text-white p-1" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800"
                        >
                            <div className="flex flex-col p-4 space-y-2">
                                {['Serviços', 'Produtos', 'Contato'].map((item) => (
                                    <a
                                        key={item}
                                        href={`#${item.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")}`}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-lg font-bold text-gray-800 dark:text-gray-200 py-3 border-b border-gray-100 dark:border-gray-900"
                                    >
                                        {item}
                                    </a>
                                ))}
                                <a
                                    href={whatsappLink}
                                    className="mt-4 w-full bg-yellow-500 text-black py-3 rounded-lg font-bold flex justify-center items-center"
                                >
                                    <Phone className="w-5 h-5 mr-2" />
                                    Chamar no Zap
                                </a>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            {/* HERO SECTION */}
            <section className="relative pt-36 pb-20 px-4 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-yellow-50/50 dark:bg-yellow-900/10 -skew-x-12 translate-x-20 z-0 hidden lg:block pointer-events-none" />

                <div className="container mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

                            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight text-gray-900 dark:text-white">
                                A Referência em <br />
                                <span className="relative inline-block">
                                    <span className="relative z-10 text-yellow-600 dark:text-yellow-500">Smartphones</span>
                                    <span className="absolute bottom-2 left-0 w-full h-3 bg-yellow-200 dark:bg-yellow-900/50 -z-0 -rotate-1"></span>
                                </span>
                                <br />em Dourados.
                            </h1>

                            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-lg">
                                A <strong>GURICELL</strong> tem o melhor preço, e a assistência mais rápida de Dourados.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <a href={whatsappLink} target="_blank" className="bg-black dark:bg-yellow-500 hover:bg-gray-800 dark:hover:bg-yellow-400 text-white dark:text-black text-lg px-8 py-4 rounded-xl flex items-center justify-center font-bold transition transform hover:-translate-y-1 shadow-xl">
                                    Falar com Vendedor <ArrowRight className="w-5 h-5 ml-2" />
                                </a>
                                <a href="#servicos" className="bg-white dark:bg-gray-900 text-black dark:text-white border-2 border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-yellow-500 text-lg px-8 py-4 rounded-xl font-bold transition flex items-center justify-center">
                                    Ver Serviços
                                </a>
                            </div>

                            <div className="mt-10 flex items-center gap-6 text-sm font-semibold text-gray-500 dark:text-gray-400">
                                <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Garantia de Loja</div>
                                <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Peças Originais</div>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative flex justify-center items-center">
                            <div className="relative z-10 w-full rounded-3xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl bg-gray-100 dark:bg-gray-900 aspect-video lg:aspect-[4/3]">
                                <img
                                    src="https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=1200&q=80"
                                    alt="Assistência Técnica GuriCell"
                                    className="w-full h-full object-cover"
                                />

                                <div className="absolute bottom-6 left-6 right-6 bg-white/95 dark:bg-black/90 backdrop-blur p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                                    <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-green-600 dark:text-green-400">
                                        <Wrench className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Status da Oficina</p>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">Aberto agora para reparos</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400 rounded-full blur-3xl opacity-20"></div>
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400 rounded-full blur-3xl opacity-20"></div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* SERVICES */}
            <section id="servicos" className="relative py-20 px-4 bg-white dark:bg-[#0F0F0F] border-b border-gray-100 dark:border-gray-900">
                <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-t from-white dark:from-[#0F0F0F] to-transparent z-10 pointer-events-none"></div>
                <div className="container mx-auto relative z-20">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 dark:text-white">
                            O que a gente faz de melhor?
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Não somos apenas vendedores. Somos especialistas em tecnologia móvel.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <motion.div key={index} whileHover={{ y: -5 }} className="group p-8 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-yellow-500 dark:hover:border-yellow-500 transition-all duration-300">
                                <div className="w-14 h-14 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center mb-6 text-yellow-600 dark:text-yellow-500 group-hover:scale-110 transition-transform">
                                    <service.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{service.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">{service.description}</p>
                                <ul className="space-y-2">
                                    {service.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- SEÇÃO DE PRODUTOS REESTRUTURADA (COLUNAS) --- */}
            <section id="produtos" className="py-20 px-4 bg-gray-50 dark:bg-black">
                <div className="container mx-auto">

                    {/* Título Geral */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">Vitrine GuriCell</h2>
                        <p className="text-gray-500 dark:text-gray-400">Confira nossos destaques.</p>
                    </div>

                    {/* Layout de Colunas Lado a Lado */}
                    <div className="flex flex-col md:flex-row gap-8 md:gap-0">
                        
                        {/* Coluna 1: Seminovos */}
                        <ProductColumn 
                            title="Seminovos Premium" 
                            subtitle="Revisados com Garantia" 
                            items={seminovos} 
                            hasSeparator={true}
                        />

                        {/* Coluna 2: Novos (Fica no meio) */}
                        <ProductColumn 
                            title="Lançamentos & Novos" 
                            subtitle="Lacrados" 
                            items={novos} 
                            hasSeparator={true}
                        />

                        {/* Coluna 3: Acessórios */}
                        <ProductColumn 
                            title="Acessórios" 
                            subtitle="Essenciais" 
                            items={acessorios} 
                            hasSeparator={false}
                        />

                    </div>

                    {/* Mensagem se não tiver nada */}
                    {products.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-500">Carregando estoque...</p>
                        </div>
                    )}
                </div>
            </section>

            {/* SOCIAL PROOF */}
            <section className="py-20 px-4 bg-white dark:bg-[#0F0F0F] border-y border-gray-100 dark:border-gray-900">
                <div className="container mx-auto">
                    <div className="flex flex-col items-center text-center mb-12">
                        <div className="flex items-center gap-1 text-yellow-400 mb-2">
                            <Star className="w-6 h-6 fill-current" />
                            <Star className="w-6 h-6 fill-current" />
                            <Star className="w-6 h-6 fill-current" />
                            <Star className="w-6 h-6 fill-current" />
                            <Star className="w-6 h-6 fill-current" />
                        </div>
                        <h2 className="text-3xl font-extrabold dark:text-white">O que dizem sobre a GuriCell</h2>
                        <div className="flex items-center gap-2 mt-2 justify-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <p className="text-gray-500 text-sm">Avaliações do Google em tempo real</p>
                        </div>
                    </div>

                    <div className="w-full min-h-[300px]">
                        <div className="elfsight-app-bffe0e96-ae98-4515-8d05-e66f4c86d4be" data-elfsight-app-lazy></div>
                    </div>
                </div>
            </section>

            {/* CONTACT */}
            <section id="contato" className="py-20 px-4 bg-black text-white relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20"
                    style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                </div>

                <div className="container mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-block bg-yellow-500 text-black font-bold px-3 py-1 rounded mb-6 text-sm uppercase">
                                Localização
                            </div>
                            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Vem tomar um café com a gente.</h2>
                            <p className="text-gray-400 text-lg mb-8">
                                Estamos no coração de Dourados. Fácil de chegar, fácil de estacionar.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <MapPin className="w-6 h-6 text-yellow-500 mt-1" />
                                    <div>
                                        <h3 className="font-bold text-xl">Endereço</h3>
                                        <p className="text-gray-300">{addressDisplay}</p>
                                        <p className="text-gray-400 text-sm">{addressCity}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <Clock className="w-6 h-6 text-yellow-500 mt-1" />
                                    <div>
                                        <h3 className="font-bold text-xl">Horário</h3>
                                        <p className="text-gray-300">Segunda a Sábado: 08:00 às 18:00</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <Phone className="w-6 h-6 text-yellow-500 mt-1" />
                                    <div>
                                        <h3 className="font-bold text-xl">Contato</h3>
                                        <p className="text-gray-300">{whatsappDisplay}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10">
                                <a href="https://www.google.com/maps/dir//R.+Joaquim+Teixeira+Alves,+1973+-+Centro,+Dourados+-+MS" target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors">
                                    <MapPin className="w-4 h-4 mr-2" /> Traçar Rota no GPS
                                </a>
                            </div>
                        </div>

                        {/* MAPA ESTILIZADO */}
                        <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-gray-800 shadow-2xl bg-gray-900">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3704.0468325338645!2d-54.80954492494216!3d-22.22362787974203!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9486e6732774dcd7%3A0x4592816027069109!2sR.%20Joaquim%20Teixeira%20Alves%2C%201973%20-%20Centro%2C%20Dourados%20-%20MS%2C%2079801-012!5e0!3m2!1spt-BR!2sbr!4v1709123456789!5m2!1spt-BR!2sbr"
                                width="100%" height="100%" style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(83%)' }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                                className="opacity-80 hover:opacity-100 transition-opacity duration-500"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-black text-white py-8 border-t border-gray-900">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="bg-white text-black p-1 rounded text-xs font-bold">GC</div>
                        <span className="font-bold">GuriCell</span>
                    </div>
                    <p className="text-gray-500 text-sm">© 2025. Dourados - MS.</p>
                </div>
            </footer>

            {/* BOTÃO FLUTUANTE */}
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 bg-[#25D366] hover:bg-[#1dbf57] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.5)] z-50 transition-transform hover:scale-110 flex items-center justify-center">
                <Phone className="w-7 h-7" />
            </a>
        </div>
    );
}