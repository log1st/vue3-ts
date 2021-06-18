const outsideClickers = [];

export const installOutsideClick = Vue => {
  document.addEventListener('click', (event) => {
    outsideClickers.forEach(({ el, handler }) => {
      if (
        event.target === el
        || el.contains(event.target)
      ) {
        return;
      }

      handler(event);
    });
  });

  Vue.directive('outside-click', {
    bind: (
      el,
      { value: handler },
    ) => {
      if (!handler) {
        return;
      }
      requestAnimationFrame(() => {
        outsideClickers.push({el, handler});
      })
    },
    unbind: (el) => {
      outsideClickers.splice(outsideClickers.findIndex(({ el: t }) => el === t), 1);
    },
  });
}
