import { onMounted, onUnmounted } from 'vue';
import { router } from '@inertiajs/vue3';

export function useKonamiCode() {
    // Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A
    const konamiCode = [
        'f',
        'u',
        'r',
        'r',
        'y',
    ];

    let konamiIndex = 0;
    let lastKeyTime = 0;
    const COOLDOWN = 2000; // 2 secondes en millisecondes

    const handleKeydown = (e: KeyboardEvent) => {
        const target = e.target as HTMLElement;

        // Ne pas déclencher si on est dans une zone de texte
        if (
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.getAttribute('contenteditable') === 'true'
        ) {
            return;
        }

        const currentTime = Date.now();

        // Vérifier le cooldown
        if (konamiIndex > 0 && currentTime - lastKeyTime > COOLDOWN) {
            konamiIndex = 0;
        }

        lastKeyTime = currentTime;

        const key = e.key.toLowerCase();

        // Vérifier si la touche correspond à la séquence
        if (key === konamiCode[konamiIndex].toLowerCase()) {
            konamiIndex++;

            // Si la séquence complète est entrée
            if (konamiIndex === konamiCode.length) {
                konamiIndex = 0;
                router.visit('/admin/login');
            }
        } else {
            // Réinitialiser si la séquence est incorrecte
            konamiIndex = 0;
        }
    };

    onMounted(() => {
        window.addEventListener('keydown', handleKeydown);
    });

    onUnmounted(() => {
        window.removeEventListener('keydown', handleKeydown);
    });
}
