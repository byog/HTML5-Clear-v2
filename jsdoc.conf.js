'use strict'

module.exports = {
    tags: {
        allowUnknownTags: true,
    },
    source: {
        include: ['js/', './README.md'],
        exclude: ['js/zepto.js'],
    },
    // plugins: ['plugins/markdown'],
    opts: {
        encoding: 'utf8',
        template: 'node_modules/docdash',
        destination: './jsdoc-out/',
        recurse: true,
        verbose: true,
    },
    // markdown: {
    //     parser: 'gfm',
    //     hardwrap: true,
    //     idInHeadings: true,
    // },
    templates: {
        cleverLinks: false,
        monospaceLinks: false,
        default: {
            outputSourceFiles: true,
            includeDate: false,
            useLongnameInNav: true,
        },
    },
    docdash: {
        static: true,
        sort: false,
        sectionOrder: [
            'Interfaces',
            'Namespaces',
            'Classes',
            'Modules',
            'Externals',
            'Events',
            'Mixins',
            'Tutorials',
        ],
        disqus: '',
        openGraph: {
            title: 'Docdash',
            type: 'website',
            image:
                'https://cloud.githubusercontent.com/assets/447956/13398144/4dde7f36-defd-11e5-8909-1a9013302cb9.png',
            site_name: 'Docdash',
            url: 'http://clenemt.github.io/docdash/',
        },
        meta: {
            title: 'Docdash',
            description:
                'A clean, responsive documentation template theme for JSDoc 3.',
            keyword: 'jsdoc, docdash',
        },
        search: true,
        collapse: true,
        typedefs: true,
        removeQuotes: 'none',
        scripts: [],
        menu: {
            'Github repo': {
                href: 'https://github.com/clenemt/docdash',
                target: '_blank',
                class: 'menu-item',
                id: 'repository',
            },
        },
    },
}
