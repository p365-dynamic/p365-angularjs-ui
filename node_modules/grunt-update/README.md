# grunt-update

[![NPM version](https://badge.fury.io/js/grunt-update.png)](http://badge.fury.io/js/grunt-update)
[![Build Status](https://api.travis-ci.org/osteele/grunt-update.png?branch-master)](https://api.travis-ci.org/osteele/grunt-update.png?branch-master)
[![Build Status](https://david-dm.org/osteele/grunt-update.png)](https://david-dm.org/osteele/grunt-update.png)

Run only those tasks whose source files are more recent than their destination targets.

This is like [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch), but suitable for repeated
invocation from the command line. It also doesn't get out of date if files changed while it wasn't running.

## Getting Started
This plugin requires Grunt `~0.4.x`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-update --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-update');
```

## The "update" task

### Overview
In your project's Gruntfile, add a section named `update` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  update: {
    tasks: ['task1', 'task2', 'task3']
  },
})
```

### Usage Examples

There are three formats you can use to configure this task.

#### Short
```js
update: { tasks: ['copy', 'jade', 'sass'] }
```

This configures an `update` task that acts as though defined by:

```js
grunt.registerTask 'update', ['copy', 'jade', 'sass']
```

*except* that each of the `copy`, `jade`, and `sass` tasks will be executed *only* if their respective destination files
either do not exist, or are out of date with respect to their source files.

#### Medium
```js
update: {
  app: ['copy:app', 'jade:app', 'sass:app']
  libs: ['copy:libs', 'jade:libs', 'sass:libs']
}
```

This configures `update:app` and `update:lib` tasks. (`update` runs them both.)

#### Long
```js
update: {
  app:
    tasks: ['copy:app', 'jade:app', 'sass:app']
  libs:
    tasks: ['copy:libs', 'jade:libs', 'sass:libs']
}
```

Like the *Medium* format, this configures `update:app` and `update:lib` tasks (and `update` runs them both.)

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

* September 24, 20012 -- initial release

