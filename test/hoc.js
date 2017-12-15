/**
 * Baobab-React Mixins Unit Tests
 * ===============================
 *
 */
import assert from 'assert';
import React, {Component} from 'react';
import {mount} from 'enzyme';
import Baobab from 'baobab';
import branch, {root} from '../src/branch';


/**
 * Components.
 */
class DummyRoot extends Component {
  render() {
    return <div />;
  }
}

class BasicRoot extends Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

/**
 * Test suite.
 */
describe('Higher Order', function() {

  describe('api', function() {
    it('branch should be curried.', function() {
      const rootTest = root(new Baobab()),
            branchTest = branch({});

      assert(typeof branchTest === 'function');

      const branchWithComponentTest = branch({}, DummyRoot);
      assert(typeof branchWithComponentTest === 'function');

      const branchThenComponentTest = branch({})(DummyRoot);
      assert(typeof branchThenComponentTest === 'function');
    });

    it('root should throw an error if the passed argument is not a tree.', function() {
      assert.throws(function() {
        root(null, DummyRoot);
      }, /Baobab/);
    });

    it('branch should throw an error if the passed argument is not valid.', function() {
      assert.throws(function() {
        branch(null, DummyRoot);
      }, /invalid/);
    });

  });

  describe('binding', function() {
    it('should be possible to bind several cursors to a component.', function() {
      const tree = new Baobab({name: 'John', surname: 'Talbot'}, {asynchronous: false});

      class Child extends Component {
        render() {
          return (
            <span>
              Hello {this.props.name} {this.props.surname}
            </span>
          );
        }
      }
      const BranchedChild = branch({
        tree,
        name: 'name',
        surname: 'surname'
      }, Child);

      const wrapper = mount(<div><BranchedChild /></div>);
      assert.strictEqual(wrapper.text(), 'Hello John Talbot');
    });

    it('should be possible to register paths using typical Baobab polymorphisms.', function() {
      const tree = new Baobab({
        user: {
          name: 'John',
          surname: 'Talbot'
        }
      }, {asynchronous: false});

      root(tree);

      class Child extends Component {
        render() {
          return (
            <span>
              Hello {this.props.name} {this.props.surname}
            </span>
          );
        }
      }

      const BranchedChild = branch({
        tree,
        name: 'user.name',
        surname: 'user.surname'
      }, Child);

      const wrapper = mount(<BranchedChild />);

      assert.strictEqual(wrapper.text(), 'Hello John Talbot');
    });

    it('bound components should update along with the cursor.', function(done) {
      const tree = new Baobab({name: 'John', surname: 'Talbot'}, {asynchronous: false});

      class Child extends Component {
        render() {
          return (
            <span>
              Hello {this.props.name} {this.props.surname}
            </span>
          );
        }
      }

      const BranchedChild = branch({
        tree,
        name: 'name',
        surname: 'surname'
      }, Child);

      const wrapper = mount(<BranchedChild />);

      tree.set('surname', 'the Third');

      setTimeout(() => {
        assert.strictEqual(wrapper.text(), 'Hello John the Third');
        done();
      }, 50);
    });

    // it('should be possible to set cursors with a function.', function(done) {
    //   const tree = new Baobab({name: 'John', surname: 'Talbot'}, {asynchronous: false});

    //   class Child extends Component {
    //     render() {
    //       return (
    //         <span>
    //           Hello {this.props.name} {this.props.surname}
    //         </span>
    //       );
    //     }
    //   }

    //   const BranchedChild = branch(props => {
    //     return {
    //       tree,
    //       name: ['name'],
    //       surname: props.path
    //     };
    //   }, Child);

    //   const wrapper = mount(<BranchedChild path={['surname']}/>);

    //   tree.set('surname', 'the Third');

    //   setTimeout(() => {
    //     assert.strictEqual(wrapper.text(), 'Hello John the Third');
    //     done();
    //   }, 50);
    // });

  //   it('wrapper component should return wrapping component instance by getDecoratedComponentInstance.', function() {
  //     const tree = new Baobab({counter: 0}, {asynchronous: false});

  //     class Counter extends Component {
  //       render() {
  //         return (
  //           <span>
  //             Counter: {this.props.counter}
  //           </span>
  //         );
  //       }
  //     }

  //     const BranchedCounter = branch({tree, counter: 'counter'}, Counter);

  //     const wrapper = mount(<BranchedCounter />);
  //     const decoratedComponentInstance = wrapper.find(BranchedCounter).get(0).getDecoratedComponentInstance();

  //     assert(decoratedComponentInstance instanceof Counter);
  //   });
  });

  // describe('actions', function() {
  //   it('should be possible to dispatch actions.', function() {
  //     const tree = new Baobab({counter: 0}, {asynchronous: false});

  //     const inc = function(state, by = 1) {
  //       state.apply('counter', nb => nb + by);
  //     };

  //     class Counter extends Component {
  //       render() {
  //         const dispatch = this.props.dispatch;

  //         return (
  //           <span onClick={() => dispatch(inc)}
  //                 onChange={() => dispatch(inc, 2)}>
  //             Counter: {this.props.counter}
  //           </span>
  //         );
  //       }
  //     }

  //     const BranchedCounter = branch({tree, counter: 'counter'}, Counter);

  //     const wrapper = mount(<BranchedCounter />);

  //     assert.strictEqual(wrapper.text(), 'Counter: 0');
  //     wrapper.find('span').simulate('click');
  //     assert.strictEqual(wrapper.text(), 'Counter: 1');
  //     wrapper.find('span').simulate('change');
  //     assert.strictEqual(wrapper.text(), 'Counter: 3');
  //   });
  // });
});
