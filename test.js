const data = {
    0: 'pending',
    1: 'active',
    2: 'deleted',
  }

  const keysArr = Object.keys(data)
console.log(keysArr.find(k => data[k] === 'pending'))