const config = {
  projectName: 'todo-list',
  date: '2018-7-9',
  designWidth: 750,
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: {
    babel: {
      sourceMap: true,
      presets: [
        'env'
      ],
      plugins: [
        'transform-class-properties',
        'transform-decorators-legacy',
        'transform-object-rest-spread'
      ]
    },
    typescript: {
      compilerOptions: {
        allowSyntheticDefaultImports: true,
        baseUrl: '.',
        declaration: false,
        experimentalDecorators: true,
        jsx: 'react',
        jsxFactory: 'Nerv.createElement',
        module: 'commonjs',
        moduleResolution: 'node',
        noImplicitAny: false,
        noUnusedLocals: true,
        outDir: './dist/',
        preserveConstEnums: true,
        removeComments: false,
        rootDir: '.',
        sourceMap: true,
        strictNullChecks: true,
        target: 'es6'
      },
      include: [
        'src/**/*'
      ],
      exclude: [
        'node_modules'
      ],
      compileOnSave: false
    }
  },
  defineConstants: {
    APP_COLOR_THEME: '"#008aff"',
    APP_COLOR_GRAY: '"#f0f1f5"',
    APP_COLOR_BLACK: '"#000"',
    APP_COLOR_LIGHT_BLACK: '"#aaa"',
    NIM_APP_KEY:'"e9382d44d2b92e4d448c1e0ff716ab31"',
    CDN_URL: '"https://djcdn.baicaiyun.com/"'
  },
  weapp: {

  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    module: {
      postcss: {
        autoprefixer: {
          enable: true
        }
      }
    }
  }
}

module.exports = function(merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}