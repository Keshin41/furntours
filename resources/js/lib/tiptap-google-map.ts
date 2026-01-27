import { Node, mergeAttributes } from '@tiptap/core';

export interface GoogleMapOptions {
    HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        googleMap: {
            setGoogleMap: (options: { src: string }) => ReturnType;
        };
    }
}

export const GoogleMap = Node.create<GoogleMapOptions>({
    name: 'googleMap',

    group: 'block',

    atom: true,

    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },

    addAttributes() {
        return {
            src: {
                default: null,
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-google-map] iframe',
                getAttrs: (node) => {
                    const iframe = node as HTMLIFrameElement;
                    return {
                        src: iframe.getAttribute('src'),
                    };
                },
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            mergeAttributes(this.options.HTMLAttributes, {
                'data-google-map': '',
                class: 'my-4 aspect-video overflow-hidden rounded-lg border border-light-blue/30',
            }),
            [
                'iframe',
                mergeAttributes(HTMLAttributes, {
                    class: 'h-full w-full',
                    frameborder: '0',
                    allowfullscreen: 'true',
                    loading: 'lazy',
                    referrerpolicy: 'no-referrer-when-downgrade',
                }),
            ],
        ];
    },

    addCommands() {
        return {
            setGoogleMap:
                (options) =>
                ({ commands }) => {
                    return commands.insertContent({
                        type: this.name,
                        attrs: options,
                    });
                },
        };
    },
});
