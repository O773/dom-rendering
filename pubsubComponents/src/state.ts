import * as objectpath from 'object-path'
let state = {}

const observers = new Map<any, Set<Function>>()

const removeInitialDollar = (s: string) => s.replace(/^\$/, '')

const subscribe = (val: any, cb: (newValue: any) => void) => {
  val = removeInitialDollar(val)
  if(!observers.has(val)) {
    observers.set(val, new Set([cb]))
  } else {
    observers.get(val)?.add(cb)
  }
}

const get = (val: any) => {
  val = removeInitialDollar(val)
  return objectpath.get(state, val)
}

const set = (val: string, newValue: any) => {
  val = removeInitialDollar(val);
  objectpath.set(state, val, newValue);
  [...observers.get(val)?.values() || []].forEach(cb => cb(newValue))
}

const init = (val: Object | string | null) => {
  if (!val) {
    return
  }

  switch (typeof val) {
    case 'string': {
      state = { ...JSON.parse(val) }
      break
    }
    case 'object': {
      state = { ...val }
      break
    }
    default: {
      return
    }
  }
}

export { subscribe, get, set, init }





// const isProxy = Symbol("isProxy")

// export const subscribe = (path: string, onChange: Function, object = state) => {
//   if (!subscribers.has(path)) {
//     subscribers.set(path, new Set())
//   }

//   subscribers.get(path)?.add(onChange)

//   const value = objectpath.get(object, path)

//   return value
// }

// const handler = {
//   get(target, key) {
//     if (key === isProxy) {
//       return true
//     }

//     const prop = target[key]

//     // return if property not defined on target
//     if (!(key in target)) {
//       return
//     }

//     // set value as proxy if object
//     if (!prop[isProxy] && typeof prop === 'object')
//       target[key] = new Proxy(prop, handler)

//     return target[key]
//   },
//   set(target, key, value, receiver) {
    
//     console.log('Setting', target, `.${key} to equal`, value)

//     if(!subscribers.has(receiver)) {
//       subscribers.set(receiver, new Set())
//     } else {
//       [...subscribers.get(receiver)?.values() || []].forEach(cb => cb(value))
//     }

//     target[key] = value
//     return true
//   }
// }
