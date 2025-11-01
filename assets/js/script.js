// script.js

class CarSearch {
    constructor() {
        this.input = document.getElementById('carInput');
        this.suggestions = document.getElementById('suggestions');
        this.debounceTimer = null;
        this.selectedIndex = -1;
        
        this.initializeEvents();
        this.initializeDatabase();
    }

    initializeEvents() {
        // Evento de digitação com debounce
        this.input.addEventListener('input', (e) => {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                this.handleInput(e.target.value);
            }, 200);
        });

        // Eventos de teclado para navegação
        this.input.addEventListener('keydown', (e) => {
            this.handleKeyDown(e);
        });

        // Mostrar sugestões quando o input recebe foco
        this.input.addEventListener('focus', () => {
            if (this.input.value.length > 0) {
                this.showSuggestions();
            }
        });

        // Esconder sugestões quando clicar fora
        document.addEventListener('click', (e) => {
            if (!this.input.parentElement.contains(e.target)) {
                this.hideSuggestions();
            }
        });
    }

    initializeDatabase() {
        this.carDatabase = [
            {
                title: "Kombi - História Completa",
                url: "https://www.historiadocarro.com/kombi",
                source: "História do Carro",
                type: "site"
            },
            {
                title: "Kombi - Wikipedia",
                url: "https://pt.wikipedia.org/wiki/Volkswagen_Kombi",
                source: "Wikipedia",
                type: "wiki"
            },
            {
                title: "Kombi Venda - Modelos Antigos",
                url: "https://www.carrosantigos.com/kombi-venda",
                source: "Carros Antigos",
                type: "venda"
            },
            {
                title: "Kombi 1970 - Restauração",
                url: "https://www.restauracao.com/kombi-1970",
                source: "Restauração Veicular",
                type: "restauracao"
            },
            {
                title: "Kombi Azul - Edição Especial",
                url: "https://www.colecionadores.com/kombi-azul",
                source: "Colecionadores",
                type: "especial"
            },
            {
                title: "Fusca - História do Volkswagen",
                url: "https://pt.wikipedia.org/wiki/Volkswagen_Fusca",
                source: "História do Carro",
                type: "site"
            },
            {
                title: "Opala 1978 - Clássico Brasileiro",
                url: "https://www.carrosantigos.com/opala-1978",
                source: "Carros Antigos",
                type: "site"
            },
            {
                title: "Caravan - Clássico Brasileiro",
                url: "https://carros.ig.com.br/2022-05-22/conheca-a-historia-da-chevrolet-caravan.html",
                source: "Carros Antigos",
                type: "site"
            },
            {
                title: "Chevrolet Opala - Wikipedia",
                url: "https://pt.wikipedia.org/wiki/Chevrolet_Opala",
                source: "Wikipedia",
                type: "wiki"
            },
            {
                title: "Maverick 1975 - V8",
                url: "https://www.musclecars.com/maverick",
                source: "Muscle Cars BR",
                type: "site"
            },
            {
                title: "Dodge Charger 1970",
                url: "https://www.classicos.com/dodge-charger",
                source: "Carros Clássicos",
                type: "site"
            }
        ];
    }

    handleInput(searchTerm) {
        if (searchTerm.length < 1) {
            this.hideSuggestions();
            this.selectedIndex = -1;
            return;
        }

        const suggestions = this.getSuggestions(searchTerm);
        this.displaySuggestions(suggestions, searchTerm);
    }

    getSuggestions(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        
        return this.carDatabase.filter(item => 
            item.title.toLowerCase().includes(term) ||
            item.source.toLowerCase().includes(term)
        ).slice(0, 6); // Limita a 6 sugestões
    }

    displaySuggestions(suggestions, searchTerm) {
        if (suggestions.length === 0) {
            this.hideSuggestions();
            return;
        }

        this.suggestions.innerHTML = '';
        this.selectedIndex = -1;
        
        suggestions.forEach((suggestion, index) => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.setAttribute('data-index', index);
            
            // Destacar o texto pesquisado
            const highlightedTitle = this.highlightText(suggestion.title, searchTerm);
            const highlightedSource = this.highlightText(suggestion.source, searchTerm);
            
            item.innerHTML = `
                <div class="suggestion-icon">🔍</div>
                <div class="suggestion-text">
                    <div class="suggestion-main">${highlightedTitle}</div>
                    <div class="suggestion-source">${highlightedSource}</div>
                </div>
            `;
            
            item.addEventListener('click', () => {
                this.selectSuggestion(suggestion);
            });
            
            item.addEventListener('mouseenter', () => {
                this.setSelectedIndex(index);
            });
            
            this.suggestions.appendChild(item);
        });
        
        this.showSuggestions();
    }

    highlightText(text, searchTerm) {
        if (!searchTerm) return text;
        
        const regex = new RegExp(`(${this.escapeRegex(searchTerm)})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    handleKeyDown(e) {
        const items = this.suggestions.querySelectorAll('.suggestion-item');
        
        if (items.length === 0) return;
        
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.setSelectedIndex(this.selectedIndex + 1);
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.setSelectedIndex(this.selectedIndex - 1);
                break;
                
            case 'Enter':
                e.preventDefault();
                if (this.selectedIndex >= 0) {
                    const selectedItem = items[this.selectedIndex];
                    const suggestion = this.carDatabase.find(item => 
                        item.title === selectedItem.querySelector('.suggestion-main').textContent
                    );
                    if (suggestion) {
                        this.selectSuggestion(suggestion);
                    }
                }
                break;
                
            case 'Escape':
                this.hideSuggestions();
                break;
        }
    }

    setSelectedIndex(index) {
        const items = this.suggestions.querySelectorAll('.suggestion-item');

        if (this.selectedIndex >= 0 && items[this.selectedIndex]) {
            items[this.selectedIndex].style.backgroundColor = '';
        }
        

        if (index >= items.length) index = 0;
        if (index < 0) index = items.length - 1;
        
        this.selectedIndex = index;

    }

    selectSuggestion(suggestion) {
        console.log('Navegando para:', suggestion.url);
        window.open(suggestion.url, '_blank');
        this.hideSuggestions();
        this.input.value = suggestion.title.split(' - ')[0]; 
  }

    showSuggestions() {
        this.suggestions.style.display = 'block';
    }

    hideSuggestions() {
        this.suggestions.style.display = 'none';
        this.selectedIndex = -1;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CarSearch();
}); 