module.exports = function() {

    var kb = 'kb/set_identity_drawings/';
    var components = 'sc-web/components/set_identity/';
    var clientJsDirPath = '../sc-web/client/static/components/js/';
    var clientCssDirPath = '../sc-web/client/static/components/css/';
    var clientHtmlDirPath = '../sc-web/client/static/components/html/';
    var clientImgDirPath = '../sc-web/client/static/components/images/';

    return  {
        concat: {
            setIdentitycmp: {
                src: [
                    components + 'src/set-identity-component.js'],
                dest: clientJsDirPath + 'set_identity/set_identity.js'
            }
        },
        copy: {
            setIdentityIMG: {
                cwd: components + 'static/components/images/',
                src: ['*'],
                dest: clientImgDirPath + 'set_identity/',
                expand: true,
                flatten: true
            },
            setIdentityCSS: {
                cwd: components + 'static/components/css/',
                src: ['set_identity.css'],
                dest: clientCssDirPath,
                expand: true,
                flatten: true
            },
            setIdentityHTML: {
                cwd: components + 'static/components/html/',
                src: ['*.html'],
                dest: clientHtmlDirPath,
                expand: true,
                flatten: true
            },
            kb: {
                cwd: kb,
                src: ['*'],
                dest: '../kb/set_identity_drawings/',
                expand: true,
                flatten: true
            }
        },
        watch: {
            setcmp: {
                files: components + 'src/**',
                tasks: ['concat:set_identitycmp']
            },
            setIMG: {
                files: [components + 'static/components/images/**'],
                tasks: ['copy:set_identityIMG']
            },
            setCSS: {
                files: [components + 'static/components/css/**'],
                tasks: ['copy:set_identityCSS']
            },
            setHTML: {
                files: [components + 'static/components/html/**',],
                tasks: ['copy:set_identityHTML']
            },
            copyKB: {
                files: [kb + '**',],
                tasks: ['copy:kb']
            }
        },
        exec: {
          updateCssAndJs: 'sh add-css-and-js.sh'
        }
    }
};

