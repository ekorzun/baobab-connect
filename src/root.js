import Baobab from 'baobab';

export let $tree = null;

export default function(tree, Component) {

  if (!(tree instanceof Baobab)) {
    throw new Error('tree must be instance of Baobab');
  }

  $tree = tree;
}
