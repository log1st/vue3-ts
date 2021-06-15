import { mount } from '@vue/test-utils'
import store from '@/store'
import hotButtons from '@/components/elements/HotButtons'

export default () => {
  it('is a Vue instance', () => {
    const wrapper = mount(hotButtons, { store })
    expect(wrapper.vm).toBeTruthy()
  })

  it('is a Vue instance', () => {
    const wrapper = mount(hotButtons, { store })
    expect(wrapper.vm).toBeTruthy()
  })
}
