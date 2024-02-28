export default tree => {
  tree.match({ tag: 'code' }, node => {
    if (Array.isArray(node.content) && node.content.some(child => child?.tag)) {
      node.tag = 'div'
    }
    return node
  })
}
