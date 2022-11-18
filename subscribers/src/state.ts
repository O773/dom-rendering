import * as objectpath from 'object-path'
import { removeInitialDollar } from "./util";

let state = {}

const observers = new Map<any, Set<Function>>()

const subscribe = (jsonPath: any, onNotify: (newValue: any) => void) => {
  jsonPath = removeInitialDollar(jsonPath)
  if(!observers.has(jsonPath)) {
    observers.set(jsonPath, new Set([onNotify]))
  } else {
    observers.get(jsonPath)?.add(onNotify)
  }
}

const get = (jsonPath: string) => {
  jsonPath = removeInitialDollar(jsonPath)
  return objectpath.get(state, jsonPath)
}

const set = (jsonPath: string, newValue: any) => {
  if (get(jsonPath) === newValue) {
    return
  }
  jsonPath = removeInitialDollar(jsonPath);

  if (newValue instanceof Promise) {
    newValue.then(result => set(jsonPath, result), console.error)
    return
  }

  objectpath.set(state, jsonPath, newValue);
  const callbacks = [...observers.get(jsonPath)?.values() || []]
  observers.set(jsonPath, new Set())
  callbacks.forEach(cb => cb(newValue))
}

const init = (value: Object | string | null) => {
  if (!value) {
    return
  }

  const doSet = (val: Object | string | null) => {
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

  if (value instanceof Promise) {
      value.then(doSet)
  } else {
      doSet(value)
  }
}

export { subscribe, get, set, init }
