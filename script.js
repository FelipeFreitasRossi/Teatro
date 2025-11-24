        // Dados das Peças
        const pecas = [
            {
                id: 1,
                titulo: "O Auto da Compadecida",
                autor: "Ariano Suassuna",
                data: "Sexta, 29 Nov",
                horario: "20h00",
                duracao: "2h",
                local: "Teatro Municipal",
                imagem: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=600&fit=crop",
                classificacao: "12 anos",
                sinopse: "Comédia clássica que retrata a história de João Grilo e Chicó, dois nordestinos pobres que vivem de expedientes. Uma obra-prima do teatro brasileiro que mistura humor, religiosidade e crítica social de forma magistral.",
                genero: "Comédia"
            },
            {
                id: 2,
                titulo: "Hamlet",
                autor: "William Shakespeare",
                data: "Sábado, 30 Nov",
                horario: "19h30",
                duracao: "3h",
                local: "Teatro Municipal",
                imagem: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
                classificacao: "14 anos",
                sinopse: "A mais famosa tragédia de Shakespeare sobre vingança, loucura e traição na corte dinamarquesa. O príncipe Hamlet busca vingar a morte de seu pai em uma trama cheia de dilemas morais e existenciais.",
                genero: "Tragédia"
            },
            {
                id: 3,
                titulo: "A Casa de Bernarda Alba",
                autor: "Federico García Lorca",
                data: "Domingo, 1 Dez",
                horario: "18h00",
                duracao: "2h30",
                local: "Teatro Municipal",
                imagem: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop",
                classificacao: "16 anos",
                sinopse: "Drama intenso sobre uma viúva autoritária que mantém suas cinco filhas em reclusão após a morte do marido. Uma reflexão profunda sobre repressão, desejo e liberdade feminina na sociedade espanhola.",
                genero: "Drama"
            },
            {
                id: 4,
                titulo: "O Mágico de Oz",
                autor: "L. Frank Baum",
                data: "Sábado, 7 Dez",
                horario: "15h00",
                duracao: "1h45",
                local: "Teatro Municipal",
                imagem: "https://images.unsplash.com/photo-1514539079130-25950c84af65?w=800&h=600&fit=crop",
                classificacao: "Livre",
                sinopse: "Musical infantil que conta a jornada mágica de Dorothy pela Terra de Oz em busca do caminho de volta para casa. Com números musicais encantadores e efeitos especiais que encantam toda a família.",
                genero: "Musical Infantil"
            }
        ];

        // Parallax Hero
        const heroBg = document.getElementById('heroBg');
        let ticking = false;

        function updateParallax() {
            const scrollY = window.scrollY;
            heroBg.style.transform = `scale(${1 + scrollY * 0.0003}) translateY(${scrollY * 0.5}px)`;
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });

        // Intersection Observer para animações
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Renderizar Cards
        function renderCards() {
            const grid = document.getElementById('pecasGrid');
            
            pecas.forEach((peca, index) => {
                const card = document.createElement('article');
                card.className = 'peca-card';
                card.style.animationDelay = `${index * 0.1}s`;
                card.setAttribute('role', 'button');
                card.setAttribute('tabindex', '0');
                card.setAttribute('aria-label', `Abrir detalhes de ${peca.titulo}`);
                
                card.innerHTML = `
                    <div class="peca-image-wrapper">
                        <img src="${peca.imagem}" alt="${peca.titulo}" class="peca-image">
                        <div class="peca-overlay"></div>
                        <span class="peca-badge">${peca.genero}</span>
                    </div>
                    <div class="peca-content">
                        <h3 class="peca-title">${peca.titulo}</h3>
                        <p class="peca-autor">por ${peca.autor}</p>
                        <div class="peca-info">
                            <div class="info-item">
                                <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                <span>${peca.data}</span>
                            </div>
                            <div class="info-item">
                                <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                                <span>${peca.horario}</span>
                            </div>
                        </div>
                        <button class="peca-button" aria-label="Ver mais detalhes sobre ${peca.titulo}">Ver Detalhes</button>
                    </div>
                `;
                
                card.addEventListener('click', () => openModal(peca));
                card.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openModal(peca);
                    }
                });
                
                grid.appendChild(card);
                observer.observe(card);
            });
        }

        // Modal
        const modal = document.getElementById('modal');
        const modalClose = document.getElementById('modalClose');
        const modalImage = document.getElementById('modalImage');
        const modalTitle = document.getElementById('modalTitle');
        const modalAutor = document.getElementById('modalAutor');
        const modalSinopse = document.getElementById('modalSinopse');
        const modalBadges = document.getElementById('modalBadges');
        const modalInfo = document.getElementById('modalInfo');

        function openModal(peca) {
            modalImage.src = peca.imagem;
            modalImage.alt = peca.titulo;
            modalTitle.textContent = peca.titulo;
            modalAutor.textContent = `por ${peca.autor}`;
            modalSinopse.textContent = peca.sinopse;
            
            modalBadges.innerHTML = `
                <span class="modal-badge">${peca.genero}</span>
                <span class="modal-badge">${peca.classificacao}</span>
            `;
            
            modalInfo.innerHTML = `
                <div class="info-item">
                    <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>${peca.data}</span>
                </div>
                <div class="info-item">
                    <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>${peca.horario} (${peca.duracao})</span>
                </div>
                <div class="info-item">
                    <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>${peca.local}</span>
                </div>
            `;
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            modalClose.focus();
        }

        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        modalClose.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });

        // Observar seção header
        observer.observe(document.getElementById('sectionHeader'));

        // Inicializar
        renderCards();