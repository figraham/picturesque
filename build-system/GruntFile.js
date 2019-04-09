const path = require('path');
const libraryConfig = require('./library.config')();
const tsConfig = require('./tsconfig')(libraryConfig);
const examplesConfig = require('./examples.config')(libraryConfig);
const webpackConfigDevelopment = require('./webpack.config')(libraryConfig, 'development');
const webpackConfigProduction = require('./webpack.config')(libraryConfig, 'production');
const tslintConfig = require('./tslint.config')();

module.exports = (grunt) => {

  // ---------------------------------------------------------------------------
  // Config

  grunt.initConfig({

    shell: Object.assign({}, {
      cloneBuild: {
        command: 'git clone ' + libraryConfig.buildRepository + ' ' + libraryConfig.buildDir,
      },
      pushBuild: {
        command: 'cd build && ' + 
        'echo ----- STATUS ----- && ' + 
        'git status && ' +
        'git add . && ' +
        'echo ----- STATUS ----- && ' + 
        'git status && ' +
        'git commit -m \"🏗️ version: ' + libraryConfig.version + '\" &&' + 
        'git push origin master'
      },
      typedoc: {
        command: 'typedoc --out ./' + libraryConfig.docsDir + 
        ' --target ' + tsConfig.compilerOptions.target + 
        ' --module ' + tsConfig.compilerOptions.module + 
        ' --name ' + libraryConfig.name + 
        ' --readme ./README.md' + 
        ' --tsconfig ./src/tsconfig.json' + 
        ' --exclude **/index.ts',
      },
    }, examplesConfig.shellCommands),

    clean: {
      oldBuild: {
        src: ['./' + libraryConfig.buildDir],
      },
      preBuild: {
        src: [
          './' + libraryConfig.distDir,
          './' + libraryConfig.devDir,
        ],
      },
      tsconfig: {
        src: ['./src/tsconfig.json'],
      },
    },

    webpack: {
      // See webpack.config.js file.
      production: webpackConfigProduction,
      development: webpackConfigDevelopment,
    },

    template: {
      typings: {
        options: {
          data: {
            nameSpace: libraryConfig.nameSpace,
          }
        },
        files: [{
          dest: './' + libraryConfig.distDir + '/' + libraryConfig.name + '.d.ts',
          src: './' + libraryConfig.templateDir + '/typings.d.ts.template',
        }],
      },
    },

    examples: examplesConfig.exampleTaskLists,

    tslint: {
      options: {
        configuration: tslintConfig,
        project: path.resolve(__dirname, '../src/tsconfig.json'),
        fix: true,
      },
      src: {
        src: [
          './src/**/*.ts',
          '!./src/jasmine/**/*.ts',
        ],
      },
    },

    karma: {
      local: {
        configFile: './' + libraryConfig.buildSystemDir + '/karma.conf.js',
        detectBrowsers: {
          postDetection: function(availableBrowsers) {
            availableBrowsers.push('Electron');
            return availableBrowsers;
          },
        },
      },
      travis: {
        configFile: './' + libraryConfig.buildSystemDir + '/karma.conf.js',
        detectBrowsers: {
          preferHeadless: true,
        },
      },
    },

    json_generator: {
      tsconfig: {
        dest: './src/tsconfig.json',
        options: tsConfig,
      },
    },

  });

  // ---------------------------------------------------------------------------
  // Load Tasks

  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-template');
  grunt.loadNpmTasks('grunt-tslint');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-json-generator');

  // ---------------------------------------------------------------------------
  // Builds

  // Default
  grunt.registerTask('build', ['build:both']);

  // Both
  grunt.registerTask('build:both', [
    'build:common',
    'build:production',
    'build:development',
  ]);

  // Common
  grunt.registerTask('build:common', [
    'clean:oldBuild',
    'shell:cloneBuild',
    'clean:preBuild',
    'template:typings',
  ]);

  // Production Build
  grunt.registerTask('build:production', [
    'test',
    'docs',
    'json_generator:tsconfig',
    'webpack:production',
    'clean:tsconfig',
  ]);

  // Development Build
  grunt.registerTask('build:dev', ['build:common', 'build:development']);
  grunt.registerTask('build:development', [
    'json_generator:tsconfig',
    'webpack:development',
    'clean:tsconfig',
  ]);

  // Push Build

  grunt.registerTask('build:push', ['build', 'shell:pushBuild']);

  // ---------------------------------------------------------------------------
  // Documentation

  grunt.registerTask('docs', 'typedoc');

  grunt.registerTask('typedoc', [
    'json_generator:tsconfig',
    'shell:typedoc',
    'clean:tsconfig',
  ]);

  // ---------------------------------------------------------------------------
  // Linting

  grunt.registerTask('lint', [
    'json_generator:tsconfig',
    'tslint',
    'clean:tsconfig',
  ]);

  // ---------------------------------------------------------------------------
  // Testing

  grunt.registerTask('test', [
    'lint',
    'karma:local',
  ]);

  // ---------------------------------------------------------------------------
  // Travis

  grunt.registerTask('travis', [
    'travis:test',
    'travis:build',
  ]);

  grunt.registerTask('travis:build', [
    'build:dev',
    'docs',
  ]);

  grunt.registerTask('travis:test', [
    'lint',
    'karma:travis',
  ]);

  // ---------------------------------------------------------------------------
  // Examples

  grunt.registerMultiTask('examples', function() {
    for (let i = 0; i < this.data.tasks.length; i++) {
      grunt.task.run(this.data.tasks[i] + ':' + this.target);
    }
  });

  // ---------------------------------------------------------------------------
  // Log Configs

  grunt.registerTask('log:developmentConfig', () => {
    grunt.log.writeln("Development Webpack Config:");
    grunt.log.write(JSON.stringify(webpackConfigDevelopment, null, 2));
  });

  grunt.registerTask('log:productionConfig', () => {
    grunt.log.writeln("Development Webpack Config:");
    grunt.log.write(JSON.stringify(webpackConfigDevelopment, null, 2));
  });

  grunt.registerTask('log:libraryConfig', () => {
    grunt.log.writeln("Library Config:");
    grunt.log.write(JSON.stringify(libraryConfig, null, 2));
  });

  grunt.registerTask('log:gruntConfig', () => {
    grunt.log.writeln("Grunt Config:");
    grunt.log.write(JSON.stringify(grunt.config(), null, 2));
  });

  // ---------------------------------------------------------------------------
  // Helper Tasks

  grunt.registerTask('notask', () => { // TODO Remove
    grunt.log.writeln("No Task Implemented Yet!")
  });

}