        // Dados das Peças
        const pecas = [
            {
                id: 1,
                titulo: "O Auto da Compadecida",
                autor: "Ariano Suassuna",
                data: "Sexta, 29 Nov - 20h00",
                preco: 50
            },
            {
                id: 2,
                titulo: "Hamlet",
                autor: "William Shakespeare",
                data: "Sábado, 30 Nov - 19h30",
                preco: 70
            },
            {
                id: 3,
                titulo: "A Casa de Bernarda Alba",
                autor: "Federico García Lorca",
                data: "Domingo, 1 Dez - 18h00",
                preco: 60
            },
            {
                id: 4,
                titulo: "O Mágico de Oz",
                autor: "L. Frank Baum",
                data: "Sábado, 7 Dez - 15h00",
                preco: 40
            }
        ];

        // Layout do Teatro (simulação - em produção virá do backend)
        const layoutTeatro = {
            "Plateia Premium": {
                fileiras: ['A', 'B', 'C', 'D'],
                assentosPorFileira: 14
            },
            "Plateia": {
                fileiras: ['E', 'F', 'G', 'H', 'I', 'J'],
                assentosPorFileira: 16
            },
            "Balcão": {
                fileiras: ['K', 'L', 'M'],
                assentosPorFileira: 12
            }
        };

        // Estado da aplicação
        let pecaSelecionada = null;
        let assentosSelecionados = [];
        let assentosOcupados = {}; // Em produção, virá do backend

        // Simular assentos ocupados (em produção, virá do backend)
        function simularAssentosOcupados(pecaId) {
            const ocupados = {};
            const quantidadeOcupados = Math.floor(Math.random() * 30) + 10;
            
            const todasSecoes = Object.keys(layoutTeatro);
            for (let i = 0; i < quantidadeOcupados; i++) {
                const secao = todasSecoes[Math.floor(Math.random() * todasSecoes.length)];
                const fileiras = layoutTeatro[secao].fileiras;
                const fileira = fileiras[Math.floor(Math.random() * fileiras.length)];
                const assento = Math.floor(Math.random() * layoutTeatro[secao].assentosPorFileira) + 1;
                const id = `${secao}-${fileira}${assento}`;
                ocupados[id] = true;
            }
            
            return ocupados;
        }

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

        // Renderizar Cards das Peças
        function renderPecas() {
            const grid = document.getElementById('pecasGrid');
            
            pecas.forEach(peca => {
                const card = document.createElement('div');
                card.className = 'peca-card';
                card.setAttribute('role', 'button');
                card.setAttribute('tabindex', '0');
                card.setAttribute('aria-label', `Selecionar ${peca.titulo}`);
                
                card.innerHTML = `
                    <div class="peca-title">${peca.titulo}</div>
                    <div class="peca-info-mini">por ${peca.autor}</div>
                    <div class="peca-info-mini">Ingresso: R$ ${peca.preco.toFixed(2)}</div>
                    <div class="peca-date">📅 ${peca.data}</div>
                `;
                
                card.addEventListener('click', () => selecionarPeca(peca));
                card.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        selecionarPeca(peca);
                    }
                });
                
                grid.appendChild(card);
            });
        }

        // Selecionar Peça
        function selecionarPeca(peca) {
            pecaSelecionada = peca;
            assentosSelecionados = [];
            assentosOcupados = simularAssentosOcupados(peca.id);
            
            // Atualizar UI
            document.querySelectorAll('.peca-card').forEach(card => card.classList.remove('active'));
            event.currentTarget.classList.add('active');
            
            document.getElementById('pecaSelecionadaNome').textContent = peca.titulo;
            document.getElementById('teatroSection').style.display = 'block';
            document.getElementById('resumoCompra').style.display = 'block';
            
            renderAssentos();
            atualizarResumo();
            
            // Scroll suave até o teatro
            document.getElementById('teatroSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Renderizar Assentos
        function renderAssentos() {
            const container = document.getElementById('assentosContainer');
            container.innerHTML = '';
            
            Object.keys(layoutTeatro).forEach(secaoNome => {
                const secao = layoutTeatro[secaoNome];
                const secaoDiv = document.createElement('div');
                secaoDiv.className = 'secao';
                
                const titulo = document.createElement('h3');
                titulo.className = 'secao-titulo';
                titulo.textContent = secaoNome;
                secaoDiv.appendChild(titulo);
                
                secao.fileiras.forEach(fileira => {
                    const fileiraDiv = document.createElement('div');
                    fileiraDiv.className = 'fileira';
                    fileiraDiv.setAttribute('role', 'row');
                    
                    const label = document.createElement('div');
                    label.className = 'fileira-label';
                    label.textContent = fileira;
                    fileiraDiv.appendChild(label);
                    
                    for (let i = 1; i <= secao.assentosPorFileira; i++) {
                        // Corredor no meio
                        if (i === Math.ceil(secao.assentosPorFileira / 2) + 1) {
                            const corredor = document.createElement('div');
                            corredor.className = 'assento corredor';
                            fileiraDiv.appendChild(corredor);
                        }
                        
                        const assento = document.createElement('button');
                        assento.className = 'assento';
                        assento.textContent = i;
                        assento.setAttribute('role', 'checkbox');
                        assento.setAttribute('aria-checked', 'false');
                        
                        const assentoId = `${secaoNome}-${fileira}${i}`;
                        assento.dataset.id = assentoId;
                        assento.dataset.secao = secaoNome;
                        assento.dataset.fileira = fileira;
                        assento.dataset.numero = i;
                        
                        // Verificar se está ocupado
                        if (assentosOcupados[assentoId]) {
                            assento.classList.add('ocupado');
                            assento.disabled = true;
                            assento.setAttribute('aria-label', `Assento ${fileira}${i} - Ocupado`);
                        } else {
                            assento.setAttribute('aria-label', `Assento ${fileira}${i} - Disponível`);
                            assento.addEventListener('click', () => toggleAssento(assentoId));
                        }
                        
                        fileiraDiv.appendChild(assento);
                    }
                    
                    secaoDiv.appendChild(fileiraDiv);
                });
                
                container.appendChild(secaoDiv);
            });
        }

        // Toggle Assento
        function toggleAssento(assentoId) {
            const assentoEl = document.querySelector(`[data-id="${assentoId}"]`);
            
            if (assentosSelecionados.includes(assentoId)) {
                // Remover
                assentosSelecionados = assentosSelecionados.filter(id => id !== assentoId);
                assentoEl.classList.remove('selecionado');
                assentoEl.setAttribute('aria-checked', 'false');
            } else {
                // Adicionar
                assentosSelecionados.push(assentoId);
                assentoEl.classList.add('selecionado');
                assentoEl.setAttribute('aria-checked', 'true');
            }
            
            atualizarResumo();
        }

        // Atualizar Resumo
        function atualizarResumo() {
            const quantidade = assentosSelecionados.length;
            const total = quantidade * pecaSelecionada.preco;
            
            document.getElementById('resumoAssentos').textContent = 
                quantidade === 0 ? 'Nenhum assento selecionado' :
                quantidade === 1 ? '1 assento selecionado' :
                `${quantidade} assentos selecionados`;
            
            document.getElementById('resumoTotal').textContent = 
                `R$ ${total.toFixed(2).replace('.', ',')}`;
            
            document.getElementById('btnFinalizar').disabled = quantidade === 0;
        }

        // Finalizar Compra
        document.getElementById('btnFinalizar').addEventListener('click', () => {
            if (assentosSelecionados.length === 0) return;
            
            // Aqui você fará a chamada para o backend
            const dadosCompra = {
                pecaId: pecaSelecionada.id,
                pecaTitulo: pecaSelecionada.titulo,
                assentos: assentosSelecionados,
                quantidade: assentosSelecionados.length,
                total: assentosSelecionados.length * pecaSelecionada.preco
            };
            
            console.log('Dados para enviar ao backend:', dadosCompra);
            
            alert(`Compra simulada!\n\nPeça: ${dadosCompra.pecaTitulo}\nAssentos: ${dadosCompra.assentos.join(', ')}\nTotal: R$ ${dadosCompra.total.toFixed(2)}\n\n⚠️ Integre com seu backend para processar o pagamento!`);
            
            // Exemplo de chamada API (descomente quando tiver o backend):
            /*
            fetch('/api/reservas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosCompra)
            })
            .then(response => response.json())
            .then(data => {
                // Redirecionar para página de pagamento
                window.location.href = `/pagamento/${data.reservaId}`;
            })
            .catch(error => console.error('Erro:', error));
            */
        });

        // Inicializar
        renderPecas();