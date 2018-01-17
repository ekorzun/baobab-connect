import Baobab from 'baobab'
import React from 'react'

export let $tree = null

const scu = (cursors, props, nextProps, state, nextState) => {

  for (let keys = Object.keys(cursors), i = keys.length; i--;) {
    if (nextState[keys[i]] !== state[keys[i]]) {
      return true
    }
  }

  for (let keys = Object.keys(nextProps), i = keys.length; i--;) {
    if (nextProps[keys[i]] !== props[keys[i]]) {
      return true
    }
  }

  return false
}

export const root = function(tree, Component) {

  if (!(tree instanceof Baobab)) {
    throw new Error('tree must be instance of Baobab');
  }

  $tree = tree;
}

export default function(cursors, _Component){

  if(!cursors) {
    throw new Error('invalid cursors')
  }

  if(cursors.tree){
    $tree = cursors.tree
    delete cursors.tree
  }

  // if(!$tree) {
  //   $tree = require('./root').$tree
  // }

  if(typeof cursors === 'function') {
    cursors = cursors()
  }

  const decorator = function(Component) {

    const _cursors = {}
    let _extaProps = {}

    if(cursors.props) {
      _extaProps = cursors.props
      delete cursors.props
    }

    Object.keys(cursors).forEach(key => {
      const val = cursors[key]
      if(typeof val === 'string') {
        _cursors[key] = val.split('.')
      } else if(Array.isArray(val)) {
        _cursors[key] = val
      } else {
        _extaProps[key] = val
      }
    })

    // console.log('_cursors', _cursors);

    return class BranchedComponent extends React.Component {

      constructor(props, context) {
        super(props, context)
        this._$watcher = $tree.watch(_cursors)
        this.state = this._$watcher.get()

        for (let key of Object.keys(_extaProps)) {
          const val = _extaProps[key]
          if (typeof val === 'function') {
            _extaProps[key] = val.bind(this)
          }
        }
      }

      componentDidMount() {
        this._$watcher.on('update', this.onUpdate)
      }

      componentWillUnmount() {
        this._$watcher.release()
      }

      onUpdate = () => {
        this.setState(this._$watcher.get())
      }

      handleRef = el => {
        if(el) {
          this.$component = el
        }
      }


      shouldComponentUpdate(nextProps, nextState) {
        return scu(_cursors, this.props, nextProps, this.state, nextState)
      }


      render() {
        return <Component {...this.props} {...this.state} {..._extaProps} ref={this.handleRef} />
      }
		}
  }

  return _Component ? decorator(_Component) : decorator
}
