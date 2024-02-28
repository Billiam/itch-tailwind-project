const processNode = (tree, prefix, node) => {
  const classes = node?.attrs?.class?.trim()?.split(/\s+/)?.filter(Boolean)
  if (classes) {
    node.attrs.class = classes
      .map((className) => {
        if (className.startsWith(prefix)) {
          return className
        }
        return prefix + className
      })
      .join(' ')
  }
  if (typeof node.content === 'string' && node.content.indexOf('<') !== -1) {
    node.content = tree.parser(node.content);
  }
}

const processTree = (prefix) => (tree) => {
  tree.walk((node) => {
    processNode(tree, prefix, node)
    return node
  })
}

export default ({ classFilter, prefix } = {}) => {
  return processTree(prefix)
}
