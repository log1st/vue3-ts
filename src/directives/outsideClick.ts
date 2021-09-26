import { Directive } from 'vue';
import { awaitFrame } from '@/utils/window';

const handlers: Array<{
  el: HTMLElement;
  handler: (event: MouseEvent) => void;
}> = [];

document.addEventListener('click', (event) => {
  const { target } = event;
  handlers.forEach(({ el, handler }) => {
    if (
      el === target
      || el.contains(target as HTMLElement)
      || el.matches('input[type="file"]')
    ) {
      return;
    }
    handler(event);
  });
});

export const OutsideClickDirective: Directive = {
  async mounted(el, binding) {
    await awaitFrame();
    handlers.push({
      el,
      handler: binding.value,
    });
  },
  beforeUnmount(el) {
    handlers.splice(
      handlers.findIndex((handler) => el === handler.el),
      1,
    );
  },
};
