import { createRawSnippet } from "svelte";
import type { Snippet } from "svelte";
import { renderToString } from "preact-render-to-string";
import { render, type ContainerNode, type VNode } from "preact";
type Getters<T> = {
  [K in keyof T]: () => T[K];
};

export const createSnippet = <Params extends unknown[]>(
  fn: (...params: Getters<Params>) => VNode
): Snippet<Params> => {
  return createRawSnippet((...params) => {
    return {
      render: () => renderToString(fn(...params)),
      setup(element) {
        const parent = element.parentElement;
        if (!parent) {
          throw new Error("Parent element not found");
        }
        render(fn(...params), createRootFragment(parent, element));
        $effect(() => {
          render(fn(...params), createRootFragment(parent, element));
        });
      },
    };
  });
};

/**
 * A Preact 11+ implementation of the `replaceNode` parameter from Preact 10.
 *
 * This creates a "Persistent Fragment" (a fake DOM element) containing one or more
 * DOM nodes, which can then be passed as the `parent` argument to Preact's `render()` method.
 *
 * @see https://gist.github.com/developit/f4c67a2ede71dc2fab7f357f39cff28c
 */
function createRootFragment(
  parent: Node,
  replaceNode?: Node | Node[]
): ContainerNode {
  if (replaceNode) {
    replaceNode = Array.isArray(replaceNode) ? replaceNode : [replaceNode];
  } else {
    replaceNode = [parent];
    parent = parent.parentNode as Node;
  }
  const s: Node | null = replaceNode[replaceNode.length - 1].nextSibling;
  const fragment = {
    nodeType: 1,
    parentNode: parent,
    firstChild: replaceNode[0],
    childNodes: replaceNode,
    insertBefore: (c: ContainerNode, r: ContainerNode | null) => {
      parent.insertBefore(c as Node, (r as Node) || s);
      return c;
    },
    appendChild: (c: ContainerNode) => {
      parent.insertBefore(c as Node, s);
      return c;
    },
    contains: (c: ContainerNode) => {
      return parent.contains(c as Node);
    },
    removeChild: (c: ContainerNode) => {
      parent.removeChild(c as Node);
      return c;
    },
  } satisfies ContainerNode;
  (parent as any).__k = fragment;
  return fragment;
}
