
## Baobab-connect

[Baobab](https://github.com/Yomguithereal/baobab) and [React](https://reactjs.org) ([Preact](https://preactjs.com) / [InfernoJS](https://github.com/infernojs/inferno)) integration.

<!-- TOC -->

- [baobab-connect](#baobab-connect)
  - [Summary](#summary)
  - [Installation](#installation)
  - [Documentation](#documentation)
    - [root](#root)
    - [connect](#connect)

<!-- /TOC -->

## Installation

You can install `baobab-connect` through npm:

```
npm install baobab-connect
```

Or through yarn:

```
yarn add baobab-connect
```

*Peer dependencies*

This library necessitate that you install `baobab >= 2.0.0`.

## Documentation

This library contains two functions – `root` and `connect`. 

### root

The `root` method aims at passing a baobab tree through context so that other components (branches/containers/controllers) may use it. Typically, your app's top-level component will probably contains a root defintion.

```javascript
import Baobab from 'baobab'
import {root} from 'baobab-connect'
const tree = new Baobab({foo: {bar: 'baz'}})
root(tree) // that's it!
```

### connect

The `connect` bound to cursors, get their data from the tree given by the root.

Here is an example of displaying `foo.bar` value of our tree created at previous step:

```javascript
import connect from 'baobab-connect'

@connect({
  bar: 'foo.bar'
})
const BarComponent = ({bar}) => <span>{bar}</span>
export default BarComponent
```

