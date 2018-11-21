---
title: React Hooks
date: 2018-10-15
tags: git
---

# React Hooks


## 基本
> 在不适用React类的形式下去使用state及其他功能    
> 对现有代码没有任何影响，将在 React 16.7 中支持


## Why
1. 很难在组件之间重用有状态逻辑，需要一层一层不断的组件包装
   connecting it to a store, [Render Props](https://reactjs.org/docs/render-props.html), [HOC](https://reactjs.org/docs/higher-order-components.html)
2. 复杂的组件变得难以理解  
   业务代码，数据代码会被拆分到各个声明周期中，于是引入状态管理库，这又需要学习很多的概念及各个文件的切换，让组件复用变得越来越困难


## How
1. Hooks允许您在不更改组件层次结构的情况下重用有状态逻辑
2. Hooks允许您根据相关的部分（例如设置订阅或获取数据）将一个组件拆分为较小的函数
3. 脱离类与this，更简单的方式去实现组件


## Strategy
1. There are no plans to remove classes from React.
2. Hooks work side-by-side with existing code so you can adopt them gradually
3. we will keep supporting class components for the foreseeable future

## Glance
```react
import { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```
```react
function todosReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, {
        text: action.text,
        completed: false
      }];
    // ... other actions ...
    default:
      return state;
  }
}

function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}

function Todos() {
  const [todos, dispatch] = useReducer(todosReducer, []);

  function handleAddClick(text) {
    dispatch({ type: 'add', text });
  }

  // ...
}
```

## 相关链接
[官方介绍](https://reactjs.org/docs/hooks-intro.html) | 
[官方示例](https://reactjs.org/docs/hooks-overview.html) | 
[RFC](https://github.com/reactjs/rfcs/pull/68) | 
[Twitter Vue hook](https://mobile.twitter.com/youyuxi/status/1057148450519871489)