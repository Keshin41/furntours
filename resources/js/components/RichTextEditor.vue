<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { GoogleMap } from '@/lib/tiptap-google-map';
import { watch, ref } from 'vue';
import { Bold, Italic, List, ListOrdered, Heading2, Heading1, Heading3, Link as LinkIcon, Undo, Redo, Map, Smile, Palette, Type } from 'lucide-vue-next';

interface Props {
    modelValue: string;
}

interface Emits {
    (e: 'update:modelValue', value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const showEmojiPicker = ref(false);
const showColorPicker = ref(false);
const showFontSizePicker = ref(false);

// Couleurs prédéfinies
const colors = [
    '#FFFFFF', '#000000', '#67e8f9', '#22d3ee', '#06b6d4', // Blancs et bleus
    '#f87171', '#ef4444', '#dc2626', // Rouges
    '#fbbf24', '#f59e0b', '#d97706', // Jaunes/Oranges
    '#34d399', '#10b981', '#059669', // Verts
    '#a78bfa', '#8b5cf6', '#7c3aed', // Violets
    '#fb923c', '#f97316', '#ea580c', // Oranges
    '#f472b6', '#ec4899', '#db2777', // Roses
];

// Tailles de police
const fontSizes = [
    { label: 'Très petit', value: '0.75rem' },
    { label: 'Petit', value: '0.875rem' },
    { label: 'Normal', value: '1rem' },
    { label: 'Grand', value: '1.25rem' },
    { label: 'Très grand', value: '1.5rem' },
    { label: 'Énorme', value: '2rem' },
];

const setColor = (color: string) => {
    editor.value?.chain().focus().setColor(color).run();
    showColorPicker.value = false;
};

const setFontSize = (size: string) => {
    editor.value?.chain().focus().setMark('textStyle', { fontSize: size }).run();
    showFontSizePicker.value = false;
};

// Liste complète d'emojis organisés par catégories
const emojiCategories = {
    'Visages': ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '😶‍🌫️', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬'],
    'Animaux': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐈', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡', '🦦', '🦥', '🐁', '🐀', '🐿️', '🦔', '🐾'],
    'Nature': ['💐', '🌸', '💮', '🏵️', '🌹', '🥀', '🌺', '🌻', '🌼', '🌷', '🌱', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘️', '🍀', '🍁', '🍂', '🍃', '🌍', '🌎', '🌏', '🌐', '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌙', '🌚', '🌛', '🌜', '☀️', '🌝', '🌞', '⭐', '🌟', '✨', '⚡', '☄️', '💫', '🔥', '💥', '☁️', '⛅', '🌤️', '⛈️', '🌦️', '🌧️', '🌨️', '🌩️', '🌪️', '🌫️', '🌬️', '🌀', '🌈', '🌂', '☂️', '☔', '⛱️', '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥅', '⛳', '🏹', '🎣'],
    'Nourriture': ['🍇', '🍈', '🍉', '🍊', '🍋', '🍌', '🍍', '🥭', '🍎', '🍏', '🍐', '🍑', '🍒', '🍓', '🥝', '🍅', '🥥', '🥑', '🍆', '🥔', '🥕', '🌽', '🌶️', '🥒', '🥬', '🥦', '🧄', '🧅', '🍄', '🥜', '🌰', '🍞', '🥐', '🥖', '🥨', '🥯', '🥞', '🧇', '🧀', '🍖', '🍗', '🥩', '🥓', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🥙', '🧆', '🥚', '🍳', '🥘', '🍲', '🥣', '🥗', '🍿', '🧈', '🧂', '🥫', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍠', '🍢', '🍣', '🍤', '🍥', '🥮', '🍡', '🥟', '🥠', '🥡', '🦀', '🦞', '🦐', '🦑', '🦪', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯', '🍼', '🥛', '☕', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃', '🥤', '🧃', '🧉', '🧊'],
    'Activités': ['🎃', '🎄', '🎆', '🎇', '🧨', '✨', '🎈', '🎉', '🎊', '🎋', '🎍', '🎎', '🎏', '🎐', '🎑', '🧧', '🎀', '🎁', '🎗️', '🎟️', '🎫', '🎖️', '🏆', '🏅', '🥇', '🥈', '🥉', '⚽', '⚾', '🥎', '🏀', '🏐', '🏈', '🏉', '🎾', '🥏', '🎳', '🏏', '🏑', '🏒', '🥍', '🏓', '🏸', '🥊', '🥋', '🥅', '⛳', '⛸️', '🎣', '🤿', '🎽', '🎿', '🛷', '🥌', '🎯', '🪀', '🪁', '🎱', '🎮', '🕹️', '🎰', '🎲', '🧩', '🧸', '🪅', '🪆', '♠️', '♥️', '♦️', '♣️', '♟️', '🃏', '🀄', '🎴', '🎭', '🖼️', '🎨', '🧵', '🪡', '🧶', '🪢'],
    'Voyage': ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🦯', '🦽', '🦼', '🛴', '🚲', '🛵', '🏍️', '🛺', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚉', '✈️', '🛫', '🛬', '🛩️', '💺', '🛰️', '🚀', '🛸', '🚁', '🛶', '⛵', '🚤', '🛥️', '🛳️', '⛴️', '🚢', '⚓', '⛽', '🚧', '🚦', '🚥', '🚏', '🗺️', '🗿', '🗽', '🗼', '🏰', '🏯', '🏟️', '🎡', '🎢', '🎠', '⛲', '⛱️', '🏖️', '🏝️', '🏜️', '🌋', '⛰️', '🏔️', '🗻', '🏕️', '⛺', '🏠', '🏡', '🏘️', '🏚️', '🏗️', '🏭', '🏢', '🏬', '🏣', '🏤', '🏥', '🏦', '🏨', '🏪', '🏫', '🏩', '💒', '🏛️', '⛪', '🕌', '🕍', '🛕', '🕋'],
    'Objets': ['⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '🪙', '💰', '💳', '🧾', '💎', '⚖️', '🪜', '🧰', '🪛', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🪚', '🔩', '⚙️', '🪤', '🧱', '⛓️', '🧲', '🔫', '💣', '🧨', '🪓', '🔪', '🗡️', '⚔️', '🛡️', '🚬', '⚰️', '🪦', '⚱️', '🏺', '🔮', '📿', '🧿', '💈', '⚗️', '🔭', '🔬', '🕳️', '🩹', '🩺', '💊', '💉', '🩸', '🧬', '🦠', '🧫', '🧪', '🌡️', '🧹', '🪠', '🧺', '🧻', '🚽', '🚰', '🚿', '🛁', '🛀', '🧼', '🪒', '🧽', '🧴', '🧷', '🧹', '🧴'],
    'Symboles': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕', '🛑', '⛔', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗', '❕', '❓', '❔', '‼️', '⁉️', '🔅', '🔆', '〽️', '⚠️', '🚸', '🔱', '⚜️', '🔰', '♻️', '✅', '🈯', '💹', '❇️', '✳️', '❎', '🌐', '💠', '🔠', '🔡', '🔢', '🔣', '🔤', '🅿️', '🈳', '🈂️', '🛂', '🛃', '🛄', '🛅', '▶️', '⏸️', '⏯️', '⏹️', '⏺️', '⏭️', '⏮️', '⏩', '⏪', '⏫', '⏬', '◀️', '🔼', '🔽', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '↪️', '↩️', '⤴️', '⤵️', '🔀', '🔁', '🔂', '🔄', '🔃', '🎵', '🎶', '➕', '➖', '➗', '✖️', '♾️', '💲', '💱', '™️', '©️', '®️', '〰️', '➰', '➿', '🔚', '🔙', '🔛', '🔝', '🔜', '✔️', '☑️', '🔘', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '⚪', '🟤', '🔺', '🔻', '🔸', '🔹', '🔶', '🔷', '🔳', '🔲', '▪️', '▫️', '◾', '◽', '◼️', '◻️', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '⬛', '⬜', '🟫', '🔈', '🔇', '🔉', '🔊', '🔔', '🔕', '📣', '📢', '💬', '💭', '🗯️', '♠️', '♣️', '♥️', '♦️', '🃏', '🎴', '🀄'],
};

const allEmojis = Object.values(emojiCategories).flat();

const insertEmoji = (emoji: string) => {
    editor.value?.chain().focus().insertContent(emoji).run();
    showEmojiPicker.value = false;
};

const editor = useEditor({
    content: props.modelValue,
    extensions: [
        TextStyle,
        Color,
        StarterKit.configure({
            // Exclure Link de StarterKit pour éviter la duplication
            link: false,
        }),
        Link.configure({
            openOnClick: false,
            HTMLAttributes: {
                class: 'text-light-blue underline hover:text-blue',
            },
        }),
        GoogleMap,
    ],
    editorProps: {
        attributes: {
            class: 'prose prose-invert max-w-none min-h-[200px] focus:outline-none p-4',
        },
    },
    onUpdate: ({ editor }) => {
        emit('update:modelValue', editor.getHTML());
    },
});

watch(() => props.modelValue, (value) => {
    const isSame = editor.value?.getHTML() === value;
    if (isSame) return;
    editor.value?.commands.setContent(value, { emitUpdate: false });
});

const setLink = () => {
    const previousUrl = editor.value?.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;

    if (url === '') {
        editor.value?.chain().focus().extendMarkRange('link').unsetLink().run();
        return;
    }

    editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
};

const addGoogleMap = () => {
    const input = window.prompt(
        'Pour ajouter une carte Google Maps:\n\n' +
        'OPTION 1 - Code iframe (recommandé):\n' +
        '1. Allez sur https://www.google.com/maps\n' +
        '2. Recherchez votre adresse\n' +
        '3. Cliquez sur "Partager" → "Intégrer une carte"\n' +
        '4. Copiez tout le code <iframe>...</iframe>\n' +
        '5. Collez-le ici\n\n' +
        'OPTION 2 - Recherche d\'adresse:\n' +
        'Entrez simplement l\'adresse\n' +
        '(ex: "12 Rue de la Convention, Tours" ou "Tour Eiffel, Paris")'
    );

    if (!input) return;

    let embedUrl = '';

    // Extraire l'URL depuis un iframe
    const iframeMatch = input.match(/src=["']([^"']+)["']/);
    if (iframeMatch) {
        embedUrl = iframeMatch[1];
    }
    // Sinon, traiter comme une adresse
    else {
        const query = encodeURIComponent(input.trim());
        embedUrl = `https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=${query}`;
    }

    if (embedUrl) {
        editor.value?.chain().focus().setGoogleMap({ src: embedUrl }).run();
    }
};
</script>

<template>
    <div v-if="editor" class="rounded-lg border border-gray-600 bg-gray-800">
        <!-- Toolbar -->
        <div class="flex flex-wrap gap-1 border-b border-gray-700 bg-gray-900 p-2 sticky top-16 z-50">
            <!-- Bold -->
            <button
                type="button"
                @click="editor.chain().focus().toggleBold().run()"
                :class="{ 'bg-light-blue/20 text-light-blue': editor.isActive('bold') }"
                class="rounded p-2 hover:bg-gray-700 transition-colors"
                title="Gras"
            >
                <Bold class="h-4 w-4" />
            </button>

            <!-- Italic -->
            <button
                type="button"
                @click="editor.chain().focus().toggleItalic().run()"
                :class="{ 'bg-light-blue/20 text-light-blue': editor.isActive('italic') }"
                class="rounded p-2 hover:bg-gray-700 transition-colors"
                title="Italique"
            >
                <Italic class="h-4 w-4" />
            </button>

            <div class="w-px bg-gray-700 mx-1"></div>

            <!-- Heading 1 -->
            <button
                type="button"
                @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
                :class="{ 'bg-light-blue/20 text-light-blue': editor.isActive('heading', { level: 1 }) }"
                class="rounded p-2 hover:bg-gray-700 transition-colors"
                title="Grand titre"
            >
                <Heading1 class="h-4 w-4" />
            </button>

            <!-- Heading 2 -->
            <button
                type="button"
                @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                :class="{ 'bg-light-blue/20 text-light-blue': editor.isActive('heading', { level: 2 }) }"
                class="rounded p-2 hover:bg-gray-700 transition-colors"
                title="Titre"
            >
                <Heading2 class="h-4 w-4" />
            </button>

            <!-- Heading 3 -->
            <button
                type="button"
                @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
                :class="{ 'bg-light-blue/20 text-light-blue': editor.isActive('heading', { level: 3 }) }"
                class="rounded p-2 hover:bg-gray-700 transition-colors"
                title="Petit titre"
            >
                <Heading3 class="h-4 w-4" />
            </button>

            <div class="w-px bg-gray-700 mx-1"></div>

            <!-- Color Picker -->
            <div class="relative">
                <button
                    type="button"
                    @click="showColorPicker = !showColorPicker"
                    :class="{ 'bg-light-blue/20 text-light-blue': showColorPicker }"
                    class="rounded p-2 hover:bg-gray-700 transition-colors"
                    title="Couleur du texte"
                >
                    <Palette class="h-4 w-4" />
                </button>

                <!-- Color Picker Popup -->
                <div
                    v-if="showColorPicker"
                    class="absolute top-full mt-2 left-0 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-3 z-[100] w-64"
                >
                    <div class="grid grid-cols-6 gap-2">
                        <button
                            v-for="color in colors"
                            :key="color"
                            type="button"
                            @click="setColor(color)"
                            :style="{ backgroundColor: color }"
                            class="w-8 h-8 rounded border-2 border-gray-600 hover:scale-110 transition-transform"
                            :title="color"
                        ></button>
                    </div>
                </div>
            </div>

            <!-- Font Size Picker -->
            <div class="relative">
                <button
                    type="button"
                    @click="showFontSizePicker = !showFontSizePicker"
                    :class="{ 'bg-light-blue/20 text-light-blue': showFontSizePicker }"
                    class="rounded p-2 hover:bg-gray-700 transition-colors"
                    title="Taille du texte"
                >
                    <Type class="h-4 w-4" />
                </button>

                <!-- Font Size Picker Popup -->
                <div
                    v-if="showFontSizePicker"
                    class="absolute top-full mt-2 left-0 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-2 z-[100] w-48"
                >
                    <button
                        v-for="size in fontSizes"
                        :key="size.value"
                        type="button"
                        @click="setFontSize(size.value)"
                        class="w-full text-left px-3 py-2 hover:bg-gray-700 rounded text-white transition-colors"
                        :style="{ fontSize: size.value }"
                    >
                        {{ size.label }}
                    </button>
                </div>
            </div>

            <div class="w-px bg-gray-700 mx-1"></div>

            <!-- Bullet List -->
            <button
                type="button"
                @click="editor.chain().focus().toggleBulletList().run()"
                :class="{ 'bg-light-blue/20 text-light-blue': editor.isActive('bulletList') }"
                class="rounded p-2 hover:bg-gray-700 transition-colors"
                title="Liste à puces"
            >
                <List class="h-4 w-4" />
            </button>

            <!-- Ordered List -->
            <button
                type="button"
                @click="editor.chain().focus().toggleOrderedList().run()"
                :class="{ 'bg-light-blue/20 text-light-blue': editor.isActive('orderedList') }"
                class="rounded p-2 hover:bg-gray-700 transition-colors"
                title="Liste numérotée"
            >
                <ListOrdered class="h-4 w-4" />
            </button>

            <div class="w-px bg-gray-700 mx-1"></div>

            <!-- Link -->
            <button
                type="button"
                @click="setLink"
                :class="{ 'bg-light-blue/20 text-light-blue': editor.isActive('link') }"
                class="rounded p-2 hover:bg-gray-700 transition-colors"
                title="Lien"
            >
                <LinkIcon class="h-4 w-4" />
            </button>

            <div class="w-px bg-gray-700 mx-1"></div>

            <!-- Google Map -->

            <!-- Emoji Picker -->
            <div class="relative">
                <button
                    type="button"
                    @click="showEmojiPicker = !showEmojiPicker"
                    :class="{ 'bg-light-blue/20 text-light-blue': showEmojiPicker }"
                    class="rounded p-2 hover:bg-gray-700 transition-colors"
                    title="Ajouter un emoji"
                >
                    <Smile class="h-4 w-4" />
                </button>

                <!-- Emoji Picker Popup -->
                <div
                    v-if="showEmojiPicker"
                    class="absolute top-full mt-2 left-0 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-3 z-[100] w-96 max-h-96 overflow-y-auto"
                >
                    <div class="space-y-3">
                        <div v-for="(emojis, category) in emojiCategories" :key="category">
                            <h3 class="text-xs font-semibold text-gray-400 mb-1">{{ category }}</h3>
                            <div class="grid grid-cols-10 gap-1">
                                <button
                                    v-for="emoji in emojis"
                                    :key="emoji"
                                    type="button"
                                    @click="insertEmoji(emoji)"
                                    class="text-xl hover:bg-gray-700 rounded p-1 transition-colors"
                                    :title="emoji"
                                >
                                    {{ emoji }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="w-px bg-gray-700 mx-1"></div>
            <button
                type="button"
                @click="addGoogleMap"
                class="rounded p-2 hover:bg-gray-700 transition-colors"
                title="Ajouter une carte Google Maps"
            >
                <Map class="h-4 w-4" />
            </button>

            <div class="w-px bg-gray-700 mx-1"></div>

            <!-- Undo -->
            <button
                type="button"
                @click="editor.chain().focus().undo().run()"
                :disabled="!editor.can().undo()"
                class="rounded p-2 hover:bg-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Annuler"
            >
                <Undo class="h-4 w-4" />
            </button>

            <!-- Redo -->
            <button
                type="button"
                @click="editor.chain().focus().redo().run()"
                :disabled="!editor.can().redo()"
                class="rounded p-2 hover:bg-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Refaire"
            >
                <Redo class="h-4 w-4" />
            </button>
        </div>

        <!-- Editor -->
        <EditorContent :editor="editor" class="text-white" />
    </div>
</template>

<style>
/* Styles pour l'éditeur */
.ProseMirror {
    min-height: 200px;
}

.ProseMirror:focus {
    outline: none;
}

.ProseMirror h1 {
    font-size: 2.25rem;
    line-height: 2.5rem;
    font-weight: bold;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: #67e8f9;
}

.ProseMirror h1:first-child {
    margin-top: 0;
}

.ProseMirror h2 {
    font-size: 1.875rem;
    line-height: 2.25rem;
    font-weight: bold;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: #67e8f9;
}

.ProseMirror h2:first-child {
    margin-top: 0;
}

.ProseMirror h3 {
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: bold;
    margin-top: 1.25rem;
    margin-bottom: 0.625rem;
    color: #67e8f9;
}

.ProseMirror h3:first-child {
    margin-top: 0;
}

.ProseMirror p {
    margin-bottom: 1rem;
    line-height: 1.75;
}

.ProseMirror p:last-child {
    margin-bottom: 0;
}

.ProseMirror ul,
.ProseMirror ol {
    padding-left: 1.5rem;
    margin-top: 0.75rem;
    margin-bottom: 1rem;
}

.ProseMirror ul {
    list-style-type: disc;
}

.ProseMirror ol {
    list-style-type: decimal;
}

.ProseMirror a {
    color: #67e8f9;
    text-decoration: underline;
}

.ProseMirror a:hover {
    color: #22d3ee;
}

/* Styles pour les cartes Google Maps */
.ProseMirror div[data-google-map] {
    margin-top: 1rem;
    margin-bottom: 1rem;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    border-radius: 0.5rem;
    border: 1px solid rgba(103, 232, 249, 0.3);
}

.ProseMirror div[data-google-map] iframe {
    width: 100%;
    height: 100%;
    border: none;
}
</style>
