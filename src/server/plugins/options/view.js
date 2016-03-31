import handlebars from 'handlebars';

export const viewOptions = {
    engines: {
        html: handlebars
    },
    relativeTo: __dirname,
    path: '../../../../src/client/views',
    layout: 'master'
};